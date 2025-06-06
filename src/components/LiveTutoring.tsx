import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Video, VideoOff, Mic, MicOff, Monitor, 
  Phone, Users, MessageCircle, Hand, Settings 
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface LiveTutoringProps {
  sessionId: string;
  isHost?: boolean;
}

const LiveTutoring: React.FC<LiveTutoringProps> = ({ sessionId, isHost = false }) => {
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [participants, setParticipants] = useState<any[]>([]);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();

  // WebRTC implementation would go here
  // Note: This requires WebRTC setup with signaling server
  
  useEffect(() => {
    initializeWebRTC();
    return () => {
      cleanup();
    };
  }, [sessionId]);

  const initializeWebRTC = async () => {
    try {
      // Get user media
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      
      setIsConnected(true);
      
      toast({
        title: "সংযোগ স্থাপিত",
        description: "লাইভ সেশন চালু হয়েছে",
      });
    } catch (error) {
      toast({
        title: "ক্যামেরা/মাইক্রোফোন অ্যাক্সেস প্রয়োজন",
        description: "ভিডিও কলের জন্য অনুমতি দিন",
        variant: "destructive"
      });
    }
  };

  const cleanup = () => {
    // Clean up WebRTC connections
    if (localVideoRef.current?.srcObject) {
      const stream = localVideoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
  };

  const toggleVideo = () => {
    setIsVideoOn(!isVideoOn);
    // Toggle video track
  };

  const toggleAudio = () => {
    setIsAudioOn(!isAudioOn);
    // Toggle audio track
  };

  const toggleScreenShare = async () => {
    try {
      if (!isScreenSharing) {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({ 
          video: true 
        });
        // Replace video track with screen share
        setIsScreenSharing(true);
      } else {
        // Switch back to camera
        const cameraStream = await navigator.mediaDevices.getUserMedia({ 
          video: true 
        });
        setIsScreenSharing(false);
      }
    } catch (error) {
      toast({
        title: "স্ক্রিন শেয়ার করতে সমস্যা",
        description: "আবার চেষ্টা করুন",
        variant: "destructive"
      });
    }
  };

  const endCall = () => {
    cleanup();
    toast({
      title: "কল শেষ",
      description: "টিউটরিং সেশন সমাপ্ত হয়েছে",
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-screen p-4">
      {/* Main Video Area */}
      <div className="lg:col-span-3 space-y-4">
        <Card className="bg-black/20 backdrop-blur-lg border border-white/10 h-full">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-white flex items-center">
                <Video className="mr-2 h-5 w-5 text-green-400" />
                লাইভ টিউটরিং
                {isHost && (
                  <Badge className="ml-2 bg-red-600/20 text-red-300 border-red-500/50">
                    হোস্ট
                  </Badge>
                )}
              </CardTitle>
              <div className="flex items-center space-x-2">
                <Badge className={`${isConnected ? 'bg-green-600' : 'bg-red-600'} text-white`}>
                  {isConnected ? 'সংযুক্ত' : 'সংযোগ বিচ্ছিন্ন'}
                </Badge>
                <div className="flex items-center text-gray-400">
                  <Users className="h-4 w-4 mr-1" />
                  {participants.length + 1}
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="h-full">
            <div className="relative h-full bg-gray-900 rounded-lg overflow-hidden">
              {/* Remote Video */}
              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
              
              {/* Local Video (Picture in Picture) */}
              <div className="absolute bottom-4 right-4 w-48 h-36 bg-gray-800 rounded-lg overflow-hidden border-2 border-white/20">
                <video
                  ref={localVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
                {!isVideoOn && (
                  <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                    <VideoOff className="h-8 w-8 text-gray-400" />
                  </div>
                )}
              </div>

              {/* Screen Share Indicator */}
              {isScreenSharing && (
                <div className="absolute top-4 left-4">
                  <Badge className="bg-blue-600 text-white">
                    <Monitor className="h-3 w-3 mr-1" />
                    স্ক্রিন শেয়ার চালু
                  </Badge>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Controls */}
        <Card className="bg-black/20 backdrop-blur-lg border border-white/10">
          <CardContent className="p-4">
            <div className="flex items-center justify-center space-x-4">
              <Button
                onClick={toggleVideo}
                variant={isVideoOn ? "default" : "destructive"}
                size="lg"
                className="rounded-full w-12 h-12"
              >
                {isVideoOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
              </Button>
              
              <Button
                onClick={toggleAudio}
                variant={isAudioOn ? "default" : "destructive"}
                size="lg"
                className="rounded-full w-12 h-12"
              >
                {isAudioOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
              </Button>
              
              <Button
                onClick={toggleScreenShare}
                variant={isScreenSharing ? "secondary" : "outline"}
                size="lg"
                className="rounded-full w-12 h-12"
              >
                <Monitor className="h-5 w-5" />
              </Button>
              
              <Button
                onClick={endCall}
                variant="destructive"
                size="lg"
                className="rounded-full w-12 h-12"
              >
                <Phone className="h-5 w-5" />
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                className="rounded-full w-12 h-12"
              >
                <Hand className="h-5 w-5" />
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                className="rounded-full w-12 h-12"
              >
                <Settings className="h-5 w-5" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sidebar - Participants & Chat */}
      <div className="space-y-4">
        {/* Participants */}
        <Card className="bg-black/20 backdrop-blur-lg border border-white/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-white text-sm flex items-center">
              <Users className="mr-2 h-4 w-4" />
              অংশগ্রহণকারী ({participants.length + 1})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {/* Host */}
            <div className="flex items-center space-x-2 p-2 bg-white/5 rounded-lg">
              <Avatar className="h-8 w-8">
                <AvatarFallback>আপনি</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="text-white text-sm font-medium">আপনি</p>
                {isHost && (
                  <Badge className="bg-red-600/20 text-red-300 text-xs">হোস্ট</Badge>
                )}
              </div>
              <div className="flex space-x-1">
                {isVideoOn && <Video className="h-3 w-3 text-green-400" />}
                {isAudioOn && <Mic className="h-3 w-3 text-green-400" />}
              </div>
            </div>
            
            {/* Other Participants */}
            {participants.map((participant, index) => (
              <div key={index} className="flex items-center space-x-2 p-2 bg-white/5 rounded-lg">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>{participant.name?.charAt(0) || 'U'}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-white text-sm">{participant.name}</p>
                </div>
                <div className="flex space-x-1">
                  {participant.videoOn && <Video className="h-3 w-3 text-green-400" />}
                  {participant.audioOn && <Mic className="h-3 w-3 text-green-400" />}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Live Chat */}
        <Card className="bg-black/20 backdrop-blur-lg border border-white/10 flex-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-white text-sm flex items-center">
              <MessageCircle className="mr-2 h-4 w-4" />
              লাইভ চ্যাট
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center text-gray-400 py-4">
              <MessageCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">চ্যাট শীঘ্রই উপলব্ধ</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LiveTutoring;
