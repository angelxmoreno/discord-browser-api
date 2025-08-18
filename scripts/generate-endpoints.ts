import { writeFileSync } from 'node:fs';
import { endpointConfigs } from '../src/utils/endpointsConfig';

function generateEndpointClass(category: string, endpoints: Record<string, unknown>): string {
    const methods = Object.entries(endpoints)
        .map(([name, config]) => {
            const methodName = name;
            const returnType = `Promise<${config.returnsType}>`;
            const optionsType = config.optionsType;

            return `
  async ${methodName}(options${Object.keys(config.options || {}).length === 0 ? '?' : ''}: ${optionsType}): ${returnType} {
    const path = this.resolvePath('${config.path}', options);
    const response = await this.client.request({
      method: '${config.method}',
      url: path,
      ${config.method === 'GET' ? 'params: options' : 'data: options'}
    });
    return response.data;
  }`;
        })
        .join('\n');

    return `
import type { AxiosInstance } from 'axios';
import type {
  RESTGetAPICurrentUserResult,
  RESTGetAPICurrentUserGuildsResult,
  RESTGetAPIGuildResult,
  RESTGetAPIChannelResult
} from 'discord-api-types/v10';

export class ${capitalize(category)}Endpoints {
  constructor(private client: AxiosInstance) {}

  private resolvePath(path: string, options?: Record<string, unknown>): string {
    let resolvedPath = path;
    
    if (options) {
      // Replace path parameters like {guild.id} with actual values
      Object.entries(options).forEach(([key, value]) => {
        const placeholder = \`{\${key}}\`;
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
