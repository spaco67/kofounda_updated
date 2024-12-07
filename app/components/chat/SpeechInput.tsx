import React, { useState, useEffect, useRef } from 'react';
import { IconButton } from '~/components/ui/IconButton';
import { classNames } from '~/utils/classNames';
import { BsMicFill, BsMicMuteFill } from 'react-icons/bs';

interface SpeechInputProps {
  onSpeechResult: (text: string) => void;
  disabled?: boolean;
}

const languages = [
  { code: 'en-NG', name: 'English (Nigeria)' },
  { code: 'ha-NG', name: 'Hausa' },
  { code: 'ig-NG', name: 'Igbo' },
  { code: 'yo-NG', name: 'Yoruba' },
  { code: 'pcm-NG', name: 'Nigerian Pidgin' },
];

const SILENCE_TIMEOUT = 2000;

export const SpeechInput: React.FC<SpeechInputProps> = ({ onSpeechResult, disabled }) => {
  const [isListening, setIsListening] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en-NG');
  const recognitionRef = useRef<any>(null);
  const silenceTimer = useRef<NodeJS.Timeout | null>(null);
  const lastSpeechTime = useRef<number>(Date.now());

  useEffect(() => {
    try {
      // @ts-ignore - SpeechRecognition types are not available in standard TypeScript definitions
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();

        const recognition = recognitionRef.current;

        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = selectedLanguage;

        recognition.onstart = () => {
          setIsListening(true);
          setIsRecording(true);
          lastSpeechTime.current = Date.now();
          startSilenceDetection();
        };

        recognition.onresult = (event: any) => {
          const last = event.results.length - 1;
          const transcript = event.results[last][0].transcript;

          lastSpeechTime.current = Date.now();
          setIsRecording(true);

          if (event.results[last].isFinal) {
            onSpeechResult(transcript);

            try {
              recognition.stop();
              setIsRecording(false);
              setTimeout(() => {
                if (isListening) {
                  recognition.start();
                }
              }, 100);
            } catch (error) {
              console.error('Error restarting recognition:', error);
            }
          }
        };

        recognition.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);
          setIsRecording(false);
          stopSilenceDetection();
        };

        recognition.onend = () => {
          if (Date.now() - lastSpeechTime.current > SILENCE_TIMEOUT) {
            setIsListening(false);
            setIsRecording(false);
            stopSilenceDetection();
          } else if (isListening) {
            try {
              recognition.start();
            } catch (error) {
              console.error('Error restarting recognition:', error);
              setIsListening(false);
              setIsRecording(false);
              stopSilenceDetection();
            }
          }
        };
      }
    } catch (error) {
      console.error('Speech recognition setup error:', error);
    }

    return () => {
      stopSilenceDetection();

      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
          setIsListening(false);
          setIsRecording(false);
        } catch (error) {
          console.error('Error stopping recognition on cleanup:', error);
        }
      }
    };
  }, [selectedLanguage]);

  const startSilenceDetection = () => {
    if (silenceTimer.current) {
      clearInterval(silenceTimer.current);
    }

    silenceTimer.current = setInterval(() => {
      if (Date.now() - lastSpeechTime.current > SILENCE_TIMEOUT) {
        if (recognitionRef.current && isListening) {
          recognitionRef.current.stop();
          setIsListening(false);
          setIsRecording(false);
          stopSilenceDetection();
        }
      }
    }, 500);
  };

  const stopSilenceDetection = () => {
    if (silenceTimer.current) {
      clearInterval(silenceTimer.current);
      silenceTimer.current = null;
    }
  };

  const toggleListening = () => {
    if (!recognitionRef.current) {
      console.error('Speech recognition not supported');
      return;
    }

    try {
      if (isListening) {
        recognitionRef.current.stop();
        setIsListening(false);
        setIsRecording(false);
        stopSilenceDetection();
      } else {
        lastSpeechTime.current = Date.now();
        recognitionRef.current.start();
        startSilenceDetection();
      }
    } catch (error) {
      console.error('Error toggling speech recognition:', error);
      setIsListening(false);
      setIsRecording(false);
      stopSilenceDetection();
    }
  };

  return (
    <div className="flex items-center gap-2">
      <select
        value={selectedLanguage}
        onChange={(e) => setSelectedLanguage(e.target.value)}
        className="p-1 rounded-lg border border-bolt-elements-borderColor bg-bolt-elements-prompt-background text-bolt-elements-textPrimary text-sm focus:outline-none focus:ring-2 focus:ring-bolt-elements-focus"
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.name}
          </option>
        ))}
      </select>

      <IconButton
        title={isListening ? 'Stop listening' : 'Start listening'}
        onClick={toggleListening}
        disabled={disabled}
        className={classNames('transition-all hover:bg-bolt-elements-button-primary-backgroundHover', {
          'text-red-500 animate-pulse': isRecording,
          'text-bolt-elements-textPrimary hover:text-bolt-elements-item-contentAccent': !isRecording,
        })}
      >
        {isRecording ? <BsMicFill className="w-5 h-5" /> : <BsMicMuteFill className="w-5 h-5" />}
      </IconButton>
    </div>
  );
};
