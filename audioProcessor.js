class AudioProcessor extends AudioWorkletProcessor {
    constructor() {
        super();
        // Nguong am luong de loc tieng im lang (tu 0.015 den 0.03 la chuan nhat)
        this.silenceThreshold = 0.02;
    }

    // Xu ly du lieu am thanh thu tu micro
    process(inputs) {
        const input = inputs[0][0];
        if (!input) return true;

        // Tinh nang luong am thanh (do lon cua am thanh) hien tai
        let sum = 0;
        for (let i = 0; i < input.length; i++) {
            sum += input[i] * input[i];
        }
        const rms = Math.sqrt(sum / input.length);

        // Neu am luong nho hon nguong (dang im lang hoac chi co tieng gio nhe), bo qua khong gui
        if (rms < this.silenceThreshold) {
            return true;
        }

        // Chi khi co nguoi noi that su thi moi dong goi va gui di
        const audioData = new Float32Array(input);
        this.port.postMessage(audioData, [audioData.buffer]);

        return true;
    }
}

registerProcessor('audioProcessor', AudioProcessor);
