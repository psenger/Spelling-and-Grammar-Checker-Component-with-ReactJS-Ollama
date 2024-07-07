/**
 * Represents the parameters used to configure an API connection.
 *
 * @interface
 */
interface ApiParameters {
    protocol?: string
    hostname?: string
    port?: number
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
    const {protocol = "http", hostname = "127.0.0.1", port} = props
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
            // prompt: `You are a spelling and grammar checker. Do not include anything in your response ( this includes the phrase "Here is the corrected text:" or extra new lines or indents ) other than the original data with both corrected spelling and grammar, keep any formating the same as the original:\n${content}`,
            // prompt: `You are a spelling and grammar checker for the English Language, with a dialect of the United States of America. Do not include anything in your response. This includes any courtesies, acknowledgments, extra new lines, indentations, or formatting other than the original data's formatting. All errors should be surrounded with an HTML span tag, with a className attribute set to "error" on the span, a data attribute called data-correct with the corrected spelling and grammar as the value, inside the span, the original text in error, keep any formatting the same as the original. For example of the expected out of "the qu1xk br0wn fox; jumped ov3r da fenze!" you should present the result "<span className="error" data-correct="The">the</span> <span className="error" data-correct="quick">qu1xk</span> <span className="error" data-correct="brown">br0wn/span> fox; jumped <span className="error" data-correct="over">ov3r</span> <span className="error" data-correct="the">da</span> <span className="error" data-correct="the">fence</span>!". The next line will start the data.\n${content}`,
            // prompt: `You are a spelling checker for the English Language, with a dialect of the United States of America. Your response must not include anything other than than the specified response as follows, this includes no courtesies, no acknowledgments, no additional formating, no extra new lines, no indentations, or correction to grammar. Your response must be the user's orginal inputed text, except, errors should be surrounded with a html5 span tag, the html5 span tag should have an attribute "data-correct" and in the value, should be the correct grammar of said error. For example of the expected out of "the qu1xk br0wn fox; jumped ov3r da fenze!" you should present the result "<span data-correct="The">the</span> <span data-correct="quick">qu1xk</span> <span data-correct="brown">br0wn/span> fox; jumped <span data-correct="over">ov3r</span> <span data-correct="the">da</span> fence!". The folling next line will start the data. Anything other than this specification will not be accepted.\n${content}`,
//             prompt: `You are a spelling checker for the English Language, with a dialect of the United States of America. Your response must not include anything other than than the specified response as follows, this includes no courtesies, no acknowledgments, no additional formating, no extra new lines, no indentations, or correction to grammar. Your response must be the user's orginal inputed text with potential spelling errors, except, errors should be surrounded with a html5 span tag, the html5 span tag should have an attribute "data-correct" and in the value, should be the correct grammar of said error. For example of the expected out of "the qu1xk br0wn fox; jumped ov3r da fenze!" you should present the result "<span data-correct="The">the</span> <span data-correct="quick">qu1xk</span> <span data-correct="brown">br0wn/span> fox; jumped <span data-correct="over">ov3r</span> <span data-correct="the">da</span> fence!". The line with "+++" will start the data and the line "---" will delmit it. Anything other than these specifications will not be accepted.
// +++
// ${content}
// ---`,
            prompt: `
You are a spelling checker for the English Language, with a dialect of the United States of America. 
You are required to stick with the orginal response and must not include anything other than the specified response with the following modiciations, 
this includes no courtesies, no acknowledgments, no additional formating, no extra new lines, no indentations. 
Your response must be the user's orginal inputed text with potential spelling and grammar errors, except, errors should be surrounded with a html5 span tag, the html5 span tag should have an attribute "data-correct" and in the value, should be the correct grammar of said error. 
For example of the expected out of "the qu1xk br0wn fox; jumped ov3r da fenze!" you should present the result "<span data-correct="The">the</span> <span data-correct="quick">qu1xk</span> <span data-correct="brown">br0wn/span> fox; jumped <span data-correct="over">ov3r</span> <span data-correct="the">da</span> fence!". Another example: "you r a fat c8t." should result in "<span data-correct="You">you</span> <span data-correct="are">r</span> a fat <span data-correct="cat">c8t</span>.". 
The line with "+++" will start the data and the line "---" will end it. Anything other than these specifications will not be accepted.
+++
${content}
---
`,
            stream: false,
            format: 'html'
        }),
        headers: {'Content-Type': 'application/json'},
        ...fetchOptions,
    })
    if (response.ok) {
        return response.json()
    }
    throw new Error('Error from server')
}
