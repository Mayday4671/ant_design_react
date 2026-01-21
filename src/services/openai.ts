/**
 * OpenAI API 服务
 * 参考文档: https://platform.openai.com/docs/quickstart
 */

// API 配置
const OPENAI_API_BASE = 'https://api.openai.com/v1';

// 消息类型
export interface ChatMessage {
    role: 'system' | 'user' | 'assistant';
    content: string;
}

// 聊天完成响应
export interface ChatCompletionResponse {
    id: string;
    object: string;
    created: number;
    model: string;
    choices: {
        index: number;
        message: ChatMessage;
        finish_reason: string;
    }[];
    usage: {
        prompt_tokens: number;
        completion_tokens: number;
        total_tokens: number;
    };
}

// 流式响应块
export interface ChatCompletionChunk {
    id: string;
    object: string;
    created: number;
    model: string;
    choices: {
        index: number;
        delta: {
            role?: string;
            content?: string;
        };
        finish_reason: string | null;
    }[];
}

// 可用模型（固定列表）
export const AVAILABLE_MODELS = [
    { value: 'gpt-4o', label: 'GPT-4o (推荐)' },
    { value: 'gpt-4o-mini', label: 'GPT-4o Mini (快速)' },
    { value: 'gpt-4-turbo', label: 'GPT-4 Turbo' },
    { value: 'gpt-4', label: 'GPT-4' },
    { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo' },
    { value: 'gemini-2.5-flash', label: 'Gemini 2.5 Flash (Google)' },
];

// 模型信息
export interface ModelInfo {
    id: string;
    object: string;
    created: number;
    owned_by: string;
}

// 模型列表响应
interface ModelsResponse {
    object: string;
    data: ModelInfo[];
}

/**
 * 获取可用模型列表
 */
export const fetchAvailableModels = async (apiKey: string): Promise<{ value: string; label: string }[]> => {
    try {
        const response = await fetch(`${OPENAI_API_BASE}/models`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
            },
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        const data: ModelsResponse = await response.json();

        // 过滤出 GPT 相关模型并排序
        const gptModels = data.data
            .filter(m => m.id.startsWith('gpt-'))
            .sort((a, b) => {
                // 优先排序规则
                const priority: Record<string, number> = {
                    'gpt-4o': 1,
                    'gpt-4o-mini': 2,
                    'gpt-4-turbo': 3,
                    'gpt-4': 4,
                    'gpt-3.5-turbo': 5,
                };
                const pa = priority[a.id] || 100;
                const pb = priority[b.id] || 100;
                return pa - pb;
            })
            .map(m => ({
                value: m.id,
                label: m.id,
            }));

        return gptModels.length > 0 ? gptModels : AVAILABLE_MODELS;
    } catch (error) {
        console.warn('获取模型列表失败，使用默认列表:', error);
        return AVAILABLE_MODELS;
    }
};

// 存储 API Key 的本地存储键
const API_KEY_STORAGE_KEY = 'openai_api_key';

// 获取存储的 API Key
export const getStoredApiKey = (): string => {
    return localStorage.getItem(API_KEY_STORAGE_KEY) || '';
};

// 保存 API Key
export const saveApiKey = (apiKey: string): void => {
    localStorage.setItem(API_KEY_STORAGE_KEY, apiKey);
};

// 清除 API Key
export const clearApiKey = (): void => {
    localStorage.removeItem(API_KEY_STORAGE_KEY);
};

// Google API Key 存储键
const GOOGLE_API_KEY_STORAGE_KEY = 'google_api_key';

// 获取存储的 Google API Key
export const getStoredGoogleApiKey = (): string => {
    return localStorage.getItem(GOOGLE_API_KEY_STORAGE_KEY) || '';
};

// 保存 Google API Key
export const saveGoogleApiKey = (apiKey: string): void => {
    localStorage.setItem(GOOGLE_API_KEY_STORAGE_KEY, apiKey);
};

// 清除 Google API Key
export const clearGoogleApiKey = (): void => {
    localStorage.removeItem(GOOGLE_API_KEY_STORAGE_KEY);
};

/**
 * 发送聊天请求（非流式）
 */
export const sendChatMessage = async (
    messages: ChatMessage[],
    model: string = 'gpt-4o-mini',
    apiKey: string
): Promise<ChatCompletionResponse> => {
    const response = await fetch(`${OPENAI_API_BASE}/chat/completions`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
            model,
            messages,
        }),
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ error: { message: response.statusText } }));
        throw new Error(error.error?.message || `API Error: ${response.status}`);
    }

    return response.json();
};

/**
 * 发送聊天请求（流式）
 * 支持 OpenAI 和 Google Gemini 模型
 */
export const sendChatMessageStream = async (
    messages: ChatMessage[],
    model: string = 'gpt-4o-mini',
    apiKey: string,
    onChunk: (content: string) => void,
    onComplete: () => void,
    onError: (error: Error) => void
): Promise<void> => {
    // 检测是否为 Gemini 模型
    const isGemini = model.startsWith('gemini-');

    try {
        if (isGemini) {
            // ========== Google Gemini API ==========
            const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta';
            const url = `${GEMINI_API_BASE}/models/${model}:streamGenerateContent?key=${apiKey}`;

            // 转换消息格式为 Gemini 格式
            const contents = messages
                .filter(m => m.role !== 'system') // Gemini 不支持 system role
                .map(m => ({
                    role: m.role === 'assistant' ? 'model' : 'user',
                    parts: [{ text: m.content }]
                }));

            // 如果有 system message，将其作为 system instruction
            const systemMessage = messages.find(m => m.role === 'system');
            const systemInstruction = systemMessage ? { parts: [{ text: systemMessage.content }] } : undefined;

            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents,
                    systemInstruction,
                    generationConfig: {
                        temperature: 0.7,
                        maxOutputTokens: 8192,
                    }
                }),
            });

            if (!response.ok) {
                const error = await response.json().catch(() => ({ error: { message: response.statusText } }));
                throw new Error(error.error?.message || `Gemini API Error: ${response.status}`);
            }

            const reader = response.body?.getReader();
            if (!reader) {
                throw new Error('No response body');
            }

            const decoder = new TextDecoder();
            let buffer = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });

                // Gemini 返回的是 JSON 数组流
                // 尝试解析完整的 JSON 对象
                const jsonMatches = buffer.match(/\{[^{}]*"text"\s*:\s*"[^"]*"[^{}]*\}/g);
                if (jsonMatches) {
                    for (const jsonStr of jsonMatches) {
                        try {
                            const parsed = JSON.parse(jsonStr);
                            if (parsed.text) {
                                onChunk(parsed.text);
                            }
                        } catch {
                            // 继续尝试
                        }
                    }
                    // 移除已处理的部分
                    const lastMatch = jsonMatches[jsonMatches.length - 1];
                    const lastIndex = buffer.lastIndexOf(lastMatch) + lastMatch.length;
                    buffer = buffer.slice(lastIndex);
                }
            }

            onComplete();
        } else {
            // ========== OpenAI API ==========
            const response = await fetch(`${OPENAI_API_BASE}/chat/completions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`,
                },
                body: JSON.stringify({
                    model,
                    messages,
                    stream: true,
                }),
            });

            if (!response.ok) {
                const error = await response.json().catch(() => ({ error: { message: response.statusText } }));
                throw new Error(error.error?.message || `API Error: ${response.status}`);
            }

            const reader = response.body?.getReader();
            if (!reader) {
                throw new Error('No response body');
            }

            const decoder = new TextDecoder();
            let buffer = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split('\n');
                buffer = lines.pop() || '';

                for (const line of lines) {
                    const trimmedLine = line.trim();
                    if (!trimmedLine || !trimmedLine.startsWith('data:')) continue;

                    const data = trimmedLine.slice(5).trim();
                    if (data === '[DONE]') {
                        onComplete();
                        return;
                    }

                    try {
                        const chunk: ChatCompletionChunk = JSON.parse(data);
                        const content = chunk.choices[0]?.delta?.content;
                        if (content) {
                            onChunk(content);
                        }
                    } catch {
                        // 忽略解析错误
                    }
                }
            }

            onComplete();
        }
    } catch (error) {
        onError(error instanceof Error ? error : new Error(String(error)));
    }
};
