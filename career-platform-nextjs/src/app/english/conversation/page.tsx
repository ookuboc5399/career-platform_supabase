'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CONVERSATION_TOPICS } from '@/types/english';
import Image from 'next/image';
import { createRealtimeClient } from '@/lib/azure-realtime-client';

export default function ConversationPage() {
  const [isListening, setIsListening] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [currentTranscript, setCurrentTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [selectedTopic, setSelectedTopic] = useState(CONVERSATION_TOPICS[0]);
  const [selectedTaskIndex, setSelectedTaskIndex] = useState(0);
  const [showHints, setShowHints] = useState(false);
  const [debugLogs, setDebugLogs] = useState<string[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');
  const [audioBuffer, setAudioBuffer] = useState<Int16Array[]>([]);
  const [isRealtimeMode, setIsRealtimeMode] = useState(false);

  const audioContextRef = useRef<AudioContext | null>(null);
  const audioWorkletNodeRef = useRef<AudioWorkletNode | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const realtimeClientRef = useRef<any>(null);
  const sessionRef = useRef<any>(null);

  const addDebugLog = (message: string) => {
    console.log(message);
    setDebugLogs(prev => [...prev, `${new Date().toISOString()} - ${message}`]);
  };

  useEffect(() => {
    const initAudio = async () => {
      try {
        audioContextRef.current = new AudioContext({
          sampleRate: 16000
        });
        
        await audioContextRef.current.audioWorklet.addModule('/audio-processor.js');
        
        const endpoint = process.env.NEXT_PUBLIC_AZURE_OPENAI_CONVA_ENDPOINT;
        const apiKey = process.env.NEXT_PUBLIC_AZURE_OPENAI_CONVA_API_KEY;

        addDebugLog(`Endpoint: ${endpoint}`);
        addDebugLog(`API Key: ${apiKey ? '[SET]' : '[NOT SET]'}`);

        if (!endpoint || !apiKey) {
          throw new Error('Azure OpenAI environment variables are not set');
        }

        realtimeClientRef.current = createRealtimeClient({
          endpoint,
          apiKey,
        });

        addDebugLog('Audio system initialized');
      } catch (error) {
        console.error('Error initializing audio:', error);
        const errorMessage = error instanceof Error ? error.message : String(error);
        addDebugLog(`Error: ${errorMessage}`);
        setError(`Failed to initialize audio system: ${errorMessage}`);
      }
    };

    initAudio();

    return () => {
      stopRecording();
    };
  }, []);

  const handleMessage = (data: any) => {
    if (data.type === 'transcript_delta') {
      setCurrentTranscript(prev => prev + data.text);
      addDebugLog(`Transcript: ${data.text}`);
    } else if (data.type === 'transcript_completed') {
      addDebugLog('Transcript completed');
    } else if (data.type === 'error') {
      const errorMessage = data.message || 'Unknown error';
      setError(errorMessage);
      addDebugLog(`Error: ${errorMessage}`);
      stopRecording();
    }
  };

  const startListening = async () => {
    try {
      addDebugLog('Starting to listen...');
      setConnectionStatus('connecting');

      sessionRef.current = await realtimeClientRef.current.createSession({
        model: process.env.NEXT_PUBLIC_AZURE_OPENAI_CONVA_DEPLOYMENT_NAME || 'gpt-4o-realtime-preview',
        temperature: 0.7,
        systemMessage: selectedTopic.systemPrompt,
        voice: 'alloy',
        onMessage: handleMessage,
      });

      setConnectionStatus('connected');
      addDebugLog('Session created successfully');
      setIsListening(true);

      if (!isRealtimeMode && audioBuffer.length > 0) {
        addDebugLog(`Sending ${audioBuffer.length} audio chunks...`);
        try {
          const combinedAudio = new Int16Array(audioBuffer.reduce((acc, chunk) => acc + chunk.length, 0));
          let offset = 0;
          for (const chunk of audioBuffer) {
            combinedAudio.set(chunk, offset);
            offset += chunk.length;
          }
          
          await sessionRef.current.sendAudio(Array.from(combinedAudio));
          await sessionRef.current.send({
            type: 'input_audio_buffer.commit'
          });
          addDebugLog('Audio data sent and committed successfully');
          setAudioBuffer([]);
        } catch (error) {
          console.error('Error sending audio data:', error);
          const errorMessage = error instanceof Error ? error.message : String(error);
          addDebugLog(`Error sending audio: ${errorMessage}`);
          setError(`Failed to send audio data: ${errorMessage}`);
          throw error;
        }
      }

      addDebugLog('Listening started');
    } catch (error) {
      console.error('Error starting to listen:', error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      addDebugLog(`Error: ${errorMessage}`);
      setError(`Failed to start listening: ${errorMessage}`);
      setIsListening(false);
      setConnectionStatus('disconnected');
    }
  };

  const stopListening = async () => {
    try {
      addDebugLog('Stopping listening...');

      if (sessionRef.current) {
        await sessionRef.current.close();
        sessionRef.current = null;
      }

      setIsListening(false);
      setCurrentTranscript('');
      addDebugLog('Listening stopped');

    } catch (error) {
      console.error('Error stopping listening:', error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      addDebugLog(`Error: ${errorMessage}`);
      setError(`Failed to stop listening: ${errorMessage}`);
    }
  };

  const startRecording = async () => {
    try {
      setError(null);
      setCurrentTranscript('');
      setConnectionStatus('connecting');
      addDebugLog('Starting audio capture...');

      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });
      mediaStreamRef.current = stream;

      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContext({
          sampleRate: 16000
        });
        await audioContextRef.current.audioWorklet.addModule('/audio-processor.js');
      } else if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
      }

      const source = audioContextRef.current!.createMediaStreamSource(stream);
      audioWorkletNodeRef.current = new AudioWorkletNode(
        audioContextRef.current!,
        'audio-processor'
      );

      source.connect(audioWorkletNodeRef.current);

      // Always start listening immediately
      await startListening();

      // In realtime mode, connect to destination
      if (isRealtimeMode) {
        audioWorkletNodeRef.current.connect(audioContextRef.current!.destination);
      }

      audioWorkletNodeRef.current.port.onmessage = async (event) => {
        if (event.data.type === 'audioData') {
          try {
            if (event.data.data instanceof Int16Array) {
              if (isRealtimeMode && sessionRef.current) {
                await sessionRef.current.sendAudio(Array.from(event.data.data));
                await sessionRef.current.send({
                  type: 'input_audio_buffer.commit'
                });
                addDebugLog(`Sent audio chunk: ${event.data.data.length} samples`);
              } else {
                setAudioBuffer(prev => [...prev, event.data.data]);
                addDebugLog(`Recorded audio chunk: ${event.data.data.length} samples`);
              }
            }
          } catch (error) {
            console.error('Error handling audio:', error);
            const errorMessage = error instanceof Error ? error.message : String(error);
            addDebugLog(`Error handling audio: ${errorMessage}`);
            setError(`Failed to handle audio data: ${errorMessage}`);
            await stopRecording();
          }
        }
      };

      setIsRecording(true);
      setConnectionStatus('connected');
      addDebugLog('Audio capture started');

    } catch (error) {
      console.error('Error starting audio capture:', error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      addDebugLog(`Error: ${errorMessage}`);
      setError(`Failed to start audio capture: ${errorMessage}`);
      setConnectionStatus('disconnected');
    }
  };

  const stopRecording = async () => {
    try {
      addDebugLog('Stopping recording...');

      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
        mediaStreamRef.current = null;
      }
      
      if (audioWorkletNodeRef.current) {
        audioWorkletNodeRef.current.port.postMessage({ type: 'stop' });
        await new Promise(resolve => setTimeout(resolve, 100));
        audioWorkletNodeRef.current.port.onmessage = null;
        audioWorkletNodeRef.current.disconnect();
        audioWorkletNodeRef.current = null;
      }

      if (audioContextRef.current) {
        await audioContextRef.current.close();
        audioContextRef.current = null;
      }

      await stopListening();

      setIsRecording(false);
      setConnectionStatus('disconnected');
      addDebugLog('Recording stopped');

    } catch (error) {
      console.error('Error stopping recording:', error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      addDebugLog(`Error: ${errorMessage}`);
      setError(`Failed to stop recording: ${errorMessage}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">英会話練習</h1>
          <div className="flex overflow-x-auto gap-4 pb-4">
            {CONVERSATION_TOPICS.map((topic) => (
              <Card
                key={topic.id}
                className={`flex-shrink-0 w-64 p-4 cursor-pointer transition-all ${
                  selectedTopic.id === topic.id
                    ? 'bg-blue-600 border-blue-400'
                    : 'bg-gray-800 hover:bg-gray-700 border-gray-600'
                }`}
                onClick={() => setSelectedTopic(topic)}
              >
                <div className="relative w-full h-32 mb-4 rounded-lg overflow-hidden">
                  <Image
                    src={topic.imageUrl}
                    alt={topic.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="text-lg font-semibold mb-2">{topic.title}</h3>
                <p className="text-sm text-gray-300">{topic.description}</p>
              </Card>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-5 gap-6">
          <div className="col-span-3 bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-4">
                {selectedTopic.tasks[selectedTaskIndex].title}
              </h2>
              <p className="text-gray-300 mb-4">
                {selectedTopic.tasks[selectedTaskIndex].description}
              </p>
              <div className="bg-gray-700 p-4 rounded-lg mb-4">
                <h3 className="text-sm font-medium mb-2">タスクの要件:</h3>
                <ul className="list-disc list-inside space-y-1">
                  {selectedTopic.tasks[selectedTaskIndex].requirements.map((req, index) => (
                    <li key={index} className="text-sm text-gray-300">{req}</li>
                  ))}
                </ul>
              </div>

              <div className="space-y-4">
                {error && (
                  <div className="bg-red-900 border border-red-700 p-4 rounded">
                    <p className="text-red-300">{error}</p>
                  </div>
                )}

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 bg-gray-700 p-1 rounded-lg">
                      <Button
                        onClick={() => setIsRealtimeMode(false)}
                        variant={!isRealtimeMode ? "default" : "ghost"}
                        className={`w-36 ${!isRealtimeMode ? 'bg-blue-600 hover:bg-blue-500' : 'hover:bg-gray-600'}`}
                        disabled={isRecording || isListening}
                      >
                        バッファモード
                      </Button>
                      <Button
                        onClick={() => setIsRealtimeMode(true)}
                        variant={isRealtimeMode ? "default" : "ghost"}
                        className={`w-36 ${isRealtimeMode ? 'bg-blue-600 hover:bg-blue-500' : 'hover:bg-gray-600'}`}
                        disabled={isRecording || isListening}
                      >
                        リアルタイム
                      </Button>
                    </div>
                    <div className="text-sm px-4 py-2 bg-gray-700 rounded-lg flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        connectionStatus === 'connected' ? 'bg-green-500' :
                        connectionStatus === 'connecting' ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`} />
                      <span>
                        {connectionStatus === 'connecting' ? '接続中' :
                         connectionStatus === 'connected' ? '接続済み' :
                         '未接続'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <Button
                      onClick={isRecording ? stopRecording : startRecording}
                      variant={isRecording ? "destructive" : "default"}
                      className="w-48"
                      disabled={connectionStatus === 'connecting'}
                    >
                      {connectionStatus === 'connecting' ? '接続中...' :
                       isRecording ? '録音停止' : '録音開始'}
                    </Button>
                  </div>
                </div>

                <div className="bg-gray-700 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold">音声認識結果</h3>
                    {isRecording && (
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                        <span className="text-sm text-gray-300">録音中</span>
                      </div>
                    )}
                  </div>
                  <p className="mt-2 whitespace-pre-wrap min-h-[100px]">
                    {currentTranscript || '録音を開始すると、ここに音声認識結果が表示されます'}
                  </p>
                </div>

              </div>
            </div>
          </div>

          <div className="col-span-2 bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">ヒント</h2>
            </div>
            <div className="space-y-4">
              {selectedTopic.tasks[selectedTaskIndex].hints.map((hint, index) => (
                <div key={index} className="bg-gray-700 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">
                      {hint.type === 'grammar' ? '📝' : hint.type === 'vocabulary' ? '📚' : '💭'}
                    </span>
                    <h4 className="font-medium">{hint.title}</h4>
                  </div>
                  <p className="text-sm text-gray-300 mb-2">{hint.description}</p>
                  <ul className="list-disc list-inside space-y-1">
                    {hint.examples.map((example, i) => (
                      <li key={i} className="text-sm text-blue-300">{example}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
