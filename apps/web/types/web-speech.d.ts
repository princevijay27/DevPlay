declare global {
  interface Window {
    SpeechRecognition?: {
      new (): SpeechRecognition;
    };
    webkitSpeechRecognition?: {
      new (): SpeechRecognition;
    };
  }

  interface PermissionDescriptorMap {
    microphone: PermissionDescriptor;
  }
}

export {};
