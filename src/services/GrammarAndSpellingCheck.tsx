/**
 * Represents the parameters used to configure an API connection.
 *
 * @interface
 */
interface ApiParameters {
    protocol?: string;
    hostname?: string;
    port?: number;
}

/**
 * Represents the parameters required to generate and send an Ollama.
 *
 * @interface
 */
interface sendOllamaGenerateParameters {
    content: string
    model?: string
    fetchOptions?: RequestInit
}

/**
 * Generates the Ollama API endpoint URL based on provided parameters.
 *
 * @param {ApiParameters} [props] - Optional parameters for customizing the API endpoint.
 * @param {string} [props.protocol] - The protocol for the API endpoint (default: "http").
 * @param {string} [props.hostname] - The hostname for the API endpoint (default: "127.0.0.1").
 * @param {string} [props.port] - The port for the API endpoint.
 * @returns {string} The generated Ollama API endpoint URL.
 */
const ollamaApiEndpoint = (props: ApiParameters = {}): string => {
    const {protocol = "http", hostname = "127.0.0.1", port} = props;
    return `${protocol}://${hostname}${port ? ':' : ''}${port ? port : ''}/api/generate`
}

/**
 * Sends a request to generate Ollama content.
 * @param {sendOllamaGenerateParameters} props - The parameters for the request.
 * @returns {Promise} - A promise that resolves to the response from the server.
 * @throws {Error} - If there is an error from the server.
 */
export const sendOllamaGenerateRequest = async (props: sendOllamaGenerateParameters) => {
    const {content, model = 'llama3', fetchOptions} = props
    const url = ollamaApiEndpoint({port: 11434})//'http://127.0.0.1:8080/api/secure/spellcheck'
    const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify({
            model,
            prompt: `You are a spelling and grammar checker. Do not include anything in your response ( this includes the phrase "Here is the corrected text:" or extra new lines or indents ) other than the original data with both corrected spelling and grammar, keep any formating the same as the original:\n${content}`,
            stream: false,
        }),
        headers: {'Content-Type': 'application/json'},
        ...fetchOptions,
    });
    if (!response.ok) {
        return response.json()
    }
    throw new Error('Error from server')
}
