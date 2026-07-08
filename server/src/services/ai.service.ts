import { config } from '../config/index';

export interface SensorData {
  sectionId: string;
  crowdCount: number;
  capacity: number;
}

export class AIService {
  /**
   * Generates AI operational crowd recommendations based on telemetry
   */
  public static async getCrowdRecommendations(sensorData: SensorData[]): Promise<string> {
    const prompt = `
      You are StadiumIQ, an AI stadium operations assistant for the FIFA World Cup 2026.
      Below is the current real-time crowd density sensor telemetry:
      ${JSON.stringify(sensorData, null, 2)}
      
      Generate a short, professional, and actionable crowd-flow recommendation for stadium staff.
      - Identify any congested sectors (occupancy > 80%).
      - Suggest specific mitigation actions (e.g. redirect fans from Gate X to Gate Y).
      - Estimate crowd distribution impact.
      - Keep it under 100 words. Format as structured bullet points.
    `;

    if (config.useMockAI) {
      return this.generateMockCrowdRecommendation(sensorData);
    }

    try {
      if (config.openaiApiKey) {
        return await this.callOpenAI(prompt);
      } else if (config.anthropicApiKey) {
        return await this.callAnthropic(prompt);
      }
      return this.generateMockCrowdRecommendation(sensorData);
    } catch (error) {
      console.error('[AI Service] Live LLM call failed, falling back to Mock Engine:', error);
      return this.generateMockCrowdRecommendation(sensorData);
    }
  }

  /**
   * Generates fan directions and translates to selected language
   */
  public static async getWayfindingResponse(
    query: string,
    language: 'en' | 'es' | 'hi'
  ): Promise<string> {
    const prompt = `
      You are StadiumIQ, a helpful multilingual fan assistant for the FIFA World Cup 2026.
      The user is asking: "${query}"
      Provide a helpful, precise answer in the following language code: "${language}" (en=English, es=Spanish, hi=Hindi).
      
      Stadium layout facts:
      - Restrooms: Concourse A (near Sec 102/104, has wheelchair access), Concourse B (near Sec 206).
      - Gate 3: North entrance, closest to public transit.
      - Gate 5: West entrance, closest to premium parking.
      - Gate 12: East entrance, closest to rideshare drop-off.
      - First Aid: Behind Section 104.
      - Food Court: Central concourse, offering international cuisines, vegan and halal options.
      
      Keep the tone friendly, welcoming, and keep the answer concise (under 3 sentences).
    `;

    if (config.useMockAI) {
      return this.generateMockWayfindingResponse(query, language);
    }

    try {
      if (config.openaiApiKey) {
        return await this.callOpenAI(prompt);
      } else if (config.anthropicApiKey) {
        return await this.callAnthropic(prompt);
      }
      return this.generateMockWayfindingResponse(query, language);
    } catch (error) {
      console.error('[AI Service] Live LLM call failed, falling back to Mock Engine:', error);
      return this.generateMockWayfindingResponse(query, language);
    }
  }

  // --- Real LLM Callers (built-in fetch, no dependencies required) ---

  private static async callOpenAI(prompt: string): Promise<string> {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.openaiApiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.5,
        max_tokens: 250
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API responded with status ${response.status}`);
    }

    const data = await response.json() as any;
    return data.choices[0].message.content.trim();
  }

  private static async callAnthropic(prompt: string): Promise<string> {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': config.anthropicApiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-haiku-20240307',
        max_tokens: 250,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    if (!response.ok) {
      throw new Error(`Anthropic API responded with status ${response.status}`);
    }

    const data = await response.json() as any;
    return data.content[0].text.trim();
  }

  // --- Mock Engines (Heuristic rules reflecting actual stadium context) ---

  private static generateMockCrowdRecommendation(sensorData: SensorData[]): string {
    const alerts: string[] = [];
    const criticalSections = sensorData.filter(s => (s.crowdCount / s.capacity) >= 0.8);

    if (criticalSections.length > 0) {
      criticalSections.forEach(sec => {
        const occupancy = Math.round((sec.crowdCount / sec.capacity) * 100);
        if (sec.sectionId === 'GATE_5') {
          alerts.push(`• **Gate 5 Congestion (${occupancy}%)**: Critical density detected. Direct incoming fans from West parking lots to **Gate 12** (currently operating at 31% capacity). Update digital signage immediately.`);
        } else if (sec.sectionId === 'SECTION_104') {
          alerts.push(`• **Section 104 Bottleneck (${occupancy}%)**: Concourse flow is constricted. Deploy stadium stewards from Section 206 to guide crowd dispersal toward Concourse B.`);
        } else if (sec.sectionId === 'CONCOURSE_B') {
          alerts.push(`• **Concourse B Crowding (${occupancy}%)**: High food/restroom queue volume. Activate auxiliary restrooms in Concourse A and update wayfinding boards.`);
        } else {
          alerts.push(`• **${sec.sectionId} Congestion (${occupancy}%)**: Occupancy exceeds threshold. Deploy secondary crowd guides to optimize traffic flow.`);
        }
      });
      return `### 🚨 StadiumIQ Operational Alerts\n\n${alerts.join('\n')}\n\n**Expected Impact:** Re-routing fans to less loaded gates is projected to reduce bottlenecks by 15-20% within 10 minutes.`;
    }

    return `### ✅ Stadium Operations Normal\n\n• **All checkpoints stable**: Average crowd density is within normal parameters (~45% capacity).\n• **Action Plan**: Continue standard monitoring. No routing changes required. Maintain regular shift rotations.`;
  }

  private static generateMockWayfindingResponse(query: string, language: 'en' | 'es' | 'hi'): string {
    const lowerQuery = query.toLowerCase();

    // Restroom answers
    if (lowerQuery.includes('restroom') || lowerQuery.includes('toilet') || lowerQuery.includes('washroom') || lowerQuery.includes('baño') || lowerQuery.includes('शौचालय')) {
      if (language === 'es') {
        return "El baño accesible más cercano se encuentra en el Pasillo A, al lado de la Sección 104. También hay baños adicionales en el Pasillo B.";
      }
      if (language === 'hi') {
        return "निकटतम सुलभ शौचालय कॉनकोर्स ए में सेक्शन 104 के पास स्थित है। कॉनकोर्स बी में भी अतिरिक्त शौचालय हैं।";
      }
      return "The nearest accessible restroom is located in Concourse A, right next to Section 104. Additional restrooms are available in Concourse B near Section 206.";
    }

    // Gate 12 answers
    if (lowerQuery.includes('gate 12') || lowerQuery.includes('puerta 12') || lowerQuery.includes('गेट 12')) {
      if (language === 'es') {
        return "Para llegar a la Puerta 12, diríjase al Pasillo Este. Está al lado de la zona de recogida de viajes compartidos (rideshare), a unos 5 minutos a pie.";
      }
      if (language === 'hi') {
        return "गेट 12 पर जाने के लिए पूर्वी कॉनकोर्स की ओर बढ़ें। यह राइडशेयर पिक-अप ज़ोन के बगल में है, लगभग 5 मिनट की पैदल दूरी पर।";
      }
      return "To reach Gate 12, walk toward the East Concourse. It is located directly adjacent to the rideshare drop-off zone, roughly a 5-minute walk.";
    }

    // Gate 3 answers
    if (lowerQuery.includes('gate 3') || lowerQuery.includes('puerta 3') || lowerQuery.includes('गेट 3')) {
      if (language === 'es') {
        return "La Puerta 3 está ubicada en el sector Norte del estadio. Es el punto de acceso más cercano si viene en transporte público.";
      }
      if (language === 'hi') {
        return "गेट 3 स्टेडियम के उत्तरी हिस्से में स्थित है। यदि आप सार्वजनिक परिवहन से आ रहे हैं तो यह सबसे निकटतम प्रवेश बिंदु है।";
      }
      return "Gate 3 is at the North side of the stadium. It is the closest entrance point if you are arriving via public transit.";
    }

    // Gate 5 answers
    if (lowerQuery.includes('gate 5') || lowerQuery.includes('puerta 5') || lowerQuery.includes('गेट 5')) {
      if (language === 'es') {
        return "La Puerta 5 está en el sector Oeste. Es la mejor entrada si estaciona en el estacionamiento premium.";
      }
      if (language === 'hi') {
        return "गेट 5 पश्चिमी भाग में है। यदि आप प्रीमियम पार्किंग में पार्क करते हैं तो यह सबसे अच्छा प्रवेश द्वार है।";
      }
      return "Gate 5 is on the West side. It is the best entrance if you are parking in the premium parking lots.";
    }

    // Seat or Section answers
    if (lowerQuery.includes('seat') || lowerQuery.includes('section') || lowerQuery.includes('asiento') || lowerQuery.includes('sección') || lowerQuery.includes('सीट') || lowerQuery.includes('सेक्शन')) {
      if (language === 'es') {
        return "Para los asientos en la Sección 102 y 104, acceda por la Puerta 3. Para la Sección 206, use la Puerta 5 y suba las escaleras mecánicas.";
      }
      if (language === 'hi') {
        return "सेक्शन 102 और 104 की सीटों के लिए, गेट 3 से प्रवेश करें। सेक्शन 206 के लिए, गेट 5 का उपयोग करें और एस्केलेटर लें।";
      }
      return "For seats in Sections 102 and 104, enter through Gate 3. For Section 206, use Gate 5 and take the escalators to the upper tier.";
    }

    // Default greeting or general help
    if (language === 'es') {
      return "¡Hola! Bienvenido al Estadio Mundialista 2026. Puedo guiarlo a su asiento, baños, salidas o ayudarlo con alertas de tráfico. ¿En qué puedo ayudarle hoy?";
    }
    if (language === 'hi') {
      return "नमस्ते! वर्ल्ड कप 2026 स्टेडियम में आपका स्वागत है। मैं आपकी सीट, शौचालय, निकास द्वार ढूंढने में सहायता कर सकता हूँ। मैं आपकी क्या मदद करूँ?";
    }
    return "Hello! Welcome to FIFA World Cup 2026 Stadium. I can guide you to your seat, restrooms, food courts, gates, or assist with live alerts. How can I help you today?";
  }
}
