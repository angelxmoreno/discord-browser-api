import { writeFileSync } from 'node:fs';
import type { EndpointConfig } from '../src/types';
import { endpointConfigs } from '../src/utils';

interface GenerationConfig {
    methodName: string;
    method: string;
    path: string;
    optionsType: string;
    returnsType: string;
    hasRequiredParams: boolean;
    pathParams: string[];
}

function extractPathParams(path: string): string[] {
    const matches = path.match(/{([^}]+)}/g);
    return matches ? matches.map((match) => match.slice(1, -1)) : [];
}

function getParameterMapping(pathParam: string): string {
    // Map path parameters like 'guild.id' to option keys like 'guildId'
    return pathParam.replace('.', '').replace('id', 'Id');
}

function extractUsedTypes(endpoints: Record<string, EndpointConfig>): string[] {
    const types = new Set<string>();
    Object.values(endpoints).forEach((config) => {
        types.add(config.returnsType);
    });
    return Array.from(types).sort();
}

function generateImports(usedTypes: string[]): string {
    if (usedTypes.length === 0) return '';

    return `import type {
  ${usedTypes.join(',\n  ')}
} from 'discord-api-types/v10';`;
}

function generateMethod(config: GenerationConfig): string {
    const { methodName, method, path, optionsType, returnsType, hasRequiredParams, pathParams } = config;

    // Generate JSDoc
    const methodDescription = methodName
        .replace(/([A-Z])/g, ' $1')
        .toLowerCase()
        .replace(/^\w/, (c) => c.toUpperCase());
    const jsdoc = `  /**
   * ${methodDescription}
   */`;

    // Determine if options parameter is optional
    const optionalParams = hasRequiredParams ? '' : '?';

    // Generate parameter filtering for non-path params
    const hasPathParams = pathParams.length > 0;
    const pathParamKeys = pathParams.map((p) => getParameterMapping(p));

    const paramsLogic = hasPathParams
        ? `    // biome-ignore lint/correctness/noUnusedVariables: Path parameters are intentionally extracted but not used\n    const { ${pathParamKeys.join(', ')}, ...requestParams } = options || {};`
        : '    const requestParams = options;';

    const requestData = method === 'GET' ? 'params: requestParams' : 'data: requestParams';

    return `${jsdoc}
  async ${methodName}(options${optionalParams}: ${optionsType}): Promise<${returnsType}> {
${paramsLogic}
    const path = this.resolvePath('${path}', options);
    const response = await this.client.request({
      method: '${method}',
      url: path,
      ${requestData}
    });
    return response.data;
  }`;
}

function generateEndpointClass(category: string, endpoints: Record<string, EndpointConfig>): string {
    // Extract generation configs for each endpoint
    const generationConfigs: GenerationConfig[] = Object.entries(endpoints).map(([name, config]) => {
        const pathParams = extractPathParams(config.path);
        // Path parameters always make the options required, fallback to checking optionsType
        const hasRequiredParams =
            pathParams.length > 0 ||
            Object.keys(config.options || {}).some((key) => !config.optionsType.includes(`${key}?`));

        return {
            methodName: name,
            method: config.method,
            path: config.path,
            optionsType: config.optionsType,
            returnsType: config.returnsType,
            hasRequiredParams,
            pathParams,
        };
    });

    const methods = generationConfigs.map((config) => generateMethod(config)).join('\n');

    const usedTypes = extractUsedTypes(endpoints);
    const importsSection = generateImports(usedTypes);

    return `import type { AxiosInstance } from 'axios';
${importsSection}

export class ${capitalize(category)}Endpoints {
  constructor(private client: AxiosInstance) {}

  private resolvePath(path: string, options?: Record<string, unknown>): string {
    let resolvedPath = path;
    
    if (options) {
      // Replace path parameters like {guild.id} with actual values from options
      // Map option keys to path placeholders (e.g., guildId -> {guild.id})
      const paramMappings: Record<string, string> = {
        'guildId': 'guild.id',
        'channelId': 'channel.id',
        'userId': 'user.id',
        'messageId': 'message.id',
        'roleId': 'role.id'
      };
      
      Object.entries(options).forEach(([key, value]) => {
        const pathParam = paramMappings[key] || key;
        const placeholder = \`{\${pathParam}}\`;
        if (resolvedPath.includes(placeholder)) {
          resolvedPath = resolvedPath.replace(placeholder, String(value));
        }
      });
    }
    
    return resolvedPath;
  }
  ${methods}
}
`;
}

function capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Generate endpoint files
Object.entries(endpointConfigs).forEach(([category, endpoints]) => {
    const content = generateEndpointClass(category, endpoints);
    writeFileSync(`src/endpoints/${category}.ts`, content);
});

console.log('Endpoints generated successfully!');
