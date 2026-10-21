import { Injectable, Optional } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';

export type ChatHistoryItem = { role: 'user' | 'model' | 'assistant'; text: string };

const CANDIDATE_MODELS = [
  'gemini-3.5-flash-lite',
  'gemini-flash-latest',
  'gemini-3.8-flash',
  'gemini-3.5-flash',
];

@Injectable()
export class AiService {
  private genAI: GoogleGenerativeAI;

  constructor(@Optional() private readonly configService?: ConfigService) {
    const apiKey =
      this.configService?.get<string>('GEMINI_API_KEY') ||
      process.env.GEMINI_API_KEY ||
      '';
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  async chat(prompt: string, history: any[] = []) {
    // 1. Chuẩn hóa format history nếu nhận từ client
    let formattedHistory = history.map((item) => ({
      role: item.role === 'assistant' ? 'model' : item.role, // Đảm bảo role là 'user' hoặc 'model'
      parts: [{ text: item.parts?.[0]?.text || item.text || '' }],
    }));

    // 2. LỌC BỎ tất cả tin nhắn 'model' đứng ở đầu mảng history
    while (formattedHistory.length > 0 && formattedHistory[0].role === 'model') {
      formattedHistory.shift();
    }

    // 3. Khởi tạo chat session với model khả dụng (có fallback tự động)
    let lastError: any = null;
    for (const modelName of CANDIDATE_MODELS) {
      try {
        const model = this.genAI.getGenerativeModel({
          model: modelName,
          systemInstruction:
            'Bạn là Nhân viên bán hàng độc quyền của ShopAI. Chuyên tư vấn về các sản phẩm công nghệ, phụ kiện và giải đáp thắc mắc mua sắm một cách nhiệt tình, lịch sự, thân thiện.',
        });

        const chatSession = model.startChat({
          history: formattedHistory,
        });

        const result = await chatSession.sendMessage(prompt);
        return {
          reply: result.response.text(),
        };
      } catch (err: any) {
        lastError = err;
        console.warn(`[AiService] Model ${modelName} gặp lỗi:`, err?.message || err);
      }
    }

    console.error('❌ [AiService] Toàn bộ models đều gặp lỗi:', lastError?.message || lastError);
    return {
      reply: 'Xin lỗi, hệ thống AI hiện đang bận hoặc quá tải. Bạn vui lòng thử lại sau giây lát nhé!',
    };
  }
}

