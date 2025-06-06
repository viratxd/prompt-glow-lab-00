
const API_BASE_URL = 'https://deepak191z-g4f-new.hf.space/api/v1';

export interface EnhanceRequest {
  userInput: string;
  systemPrompt: string;
}

export interface EnhanceResponse {
  enhancedText: string;
}

export class ChatError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ChatError';
  }
}

export async function sendMessage(content: string, replyToContent?: string): Promise<Response> {
  try {
    // Combine replyToContent and user input if reply exists
    const finalContent = replyToContent 
      ? `${replyToContent}\n\n${content}`
      : content;

    const response = await fetch(`${API_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [
          {
            role: 'user',
            content: finalContent,
          },
        ],
        model: 'gpt-4o-mini',
        stream: false,
      }),
    });

    if (!response.ok) {
      throw new ChatError(`Server error: ${response.status}`);
    }

    return response;
  } catch (error) {
    if (error instanceof ChatError) {
      throw error;
    }
    throw new ChatError('Failed to connect to chat service');
  }
}

// Enhanced prompt function that uses the new API
export const enhancePrompt = async (request: EnhanceRequest): Promise<EnhanceResponse> => {
  try {
    const combinedPrompt = `${request.systemPrompt}\n\nUser Input: ${request.userInput}`;
    const response = await sendMessage(request.userInput, request.systemPrompt);
    
    const data = await response.json();
    
    // Extract the enhanced text from the API response
    const enhancedText = data.choices?.[0]?.message?.content || 'No response received';
    
    return {
      enhancedText: enhancedText
    };
  } catch (error) {
    console.error('Enhancement failed:', error);
    throw error;
  }
};
