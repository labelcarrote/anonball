// -----------------------
// SoundManager
// -----------------------
class SoundManager{

	constructor(){
        this.mode = 0;

        // Speech Synthesis
		this.voice = null; 
		this.lang = null;
		this.speech = window.speechSynthesis;
		let voices = window.speechSynthesis.getVoices();
		for (let index = 0; index < voices.length; index++) {
			this.voice = voices[index];
			if(voices[index].lang === "fr-FR")//en-US fr-FR
				break;
		}
		
		// Synth
		// this.synth = new Tone.Synth().toMaster();
		this.synth = new Tone.PolySynth(8, Tone.Synth).toMaster();
		// this.synth = new Tone.PolySynth(8, Tone.Synth, {
		// 	"oscillator" : {
		// 		"partials" : [0, 2, 3, 4],
		// 	}
		// }).toMaster();
		// this.synth = new Tone.Synth({
		// 	"oscillator" : {
		// 		"type" : "amtriangle",
		// 		"harmonicity" : 0.5,
		// 		"modulationType" : "sine"
		// 	},
		// 	"envelope" : {
		// 		"attackCurve" : "exponential",
		// 		"attack" : 0.05,
		// 		"decay" : 0.2,
		// 		"sustain" : 0.2,
		// 		"release" : 1.5,
		// 	},
		// 	"portamento" : 0.05
		// }).toMaster();
    }
    
	keyPressed(key){
        switch (true) {
            case (this.mode === 0):
                this.say(key);        
                break;
            case (this.mode > 0):
                this.triggerSound(key);
                break;
            default:
                break;
        }
	}

	keyReleased(key){
        switch (true) {
            case (this.mode > 0):
                this.releaseSound(key);
                break;
            default:
                break;
        }
    }
    
    // --------

    set_mode(mode){
        this.mode = (mode % 3);
    }

    say(word){
		this.speech.cancel();
		this.message = new SpeechSynthesisUtterance();
		this.message.lang = this.lang;
		this.message.voice = this.voice;
		this.message.voiceURI = 'native';
		this.message.volume = 1; // 0 to 1
		this.message.rate = 1; // 0.1 to 10
		this.message.pitch = 0.4;//0.4; //0 to 2
		this.message.text = word;
		this.speech.speak(this.message);
	}
	triggerSound(key){
		this.synth.triggerAttack(this.keyToNote(key));
	}

	releaseSound(key){
		this.synth.triggerRelease(this.keyToNote(key));
	}

    keyToNote(key){
        let note = 'C4';
        
        let pentatonic_key_mapping = {
            'q' : 'C3',
			's' : 'D3',
			'd' : 'E3',
			'f' : 'G3',
			'g' : 'A3',
			'h' : 'C4',
			'j' : 'D4',
			'k' : 'E4',
			'l' : 'G4',
			'm' : 'A4'
        }

        let heptatonic_key_mapping = {
            'q' : 'C3',
			's' : 'D3',
			'd' : 'E3',
			'f' : 'F3',
			'g' : 'G3',
			'h' : 'A3',
			'j' : 'B3',
			'k' : 'C4',
			'l' : 'D4',
			'm' : 'E4'
        }

        note = (this.mode === 1) 
            ? heptatonic_key_mapping[key]
            : pentatonic_key_mapping[key];

		// switch (key) {
		// 	// pentatonic
		// 	// case 'q': note = 'C3'; break;
		// 	// case 's': note = 'D3'; break;
		// 	// case 'd': note = 'E3'; break;
		// 	// case 'f': note = 'G3'; break;
		// 	// case 'g': note = 'A3'; break;
		// 	// case 'h': note = 'C4'; break;
		// 	// case 'j': note = 'D4'; break;
		// 	// case 'k': note = 'E4'; break;
		// 	// case 'l': note = 'G4'; break;
		// 	// case 'm': note = 'A4'; break;
		// 	// heptatonic
		// 	case 'q': note = 'C3'; break;
		// 	case 's': note = 'D3'; break;
		// 	case 'd': note = 'E3'; break;
		// 	case 'f': note = 'F3'; break;
		// 	case 'g': note = 'G3'; break;
		// 	case 'h': note = 'A3'; break;
		// 	case 'j': note = 'B3'; break;
		// 	case 'k': note = 'C4'; break;
		// 	case 'l': note = 'D4'; break;
		// 	case 'm': note = 'E4'; break;
		// 	default:
		// 		break;
		// }
		return note;
	}
}