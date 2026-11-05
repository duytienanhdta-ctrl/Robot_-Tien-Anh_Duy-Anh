class AudioProcessor extends AudioWorkletProcessor {
    constructor() {
        super();
        this.silenceThreshold = 0.08;
        this.isBotSpeaking = false;

        // Lắng nghe tín hiệu trạng thái từ luồng chính (khi bot đang phát loa)
        this.port.onmessage = (event) => {
            if (event.data && typeof event.data.isBotSpeaking !== 'undefined') {
                this.isBotSpeaking = event.data.isBotSpeaking;
            }
        };
    }

    process(inputs) {
        // Nếu bot đang nói, chặn hoàn toàn micro để không bị tiếng loa dội ngược gây ngắt câu
        if (this.isBotSpeaking) {
            return true;
        }

        const input = inputs[0][0];
        if (!input) return true;

        let sum = 0;
        for (let i = 0; i < input.length; i++) {
            sum += input[i] * input[i];
        }
        const rms = Math.sqrt(sum / input.length);

        // Bỏ qua tạp âm và khoảng lặng
        if (rms < this.silenceThreshold) {
            return true;
        }

        const audioData = new Float32Array(input);
        this.port.postMessage(audioData, [audioData.buffer]);

        return true;
    }
}

registerProcessor('audioProcessor', AudioProcessor);
