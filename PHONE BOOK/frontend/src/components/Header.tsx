import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { UserPlus, Users, Sparkles, Star, Heart, Zap } from "lucide-react";

interface HeaderProps {
  showForm: boolean;
  onToggleForm: () => void;
}

export function Header({ showForm, onToggleForm }: HeaderProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [sparkleIndex, setSparkleIndex] = useState(0);
  
  const sparkleIcons = [Sparkles, Star, Heart, Zap];
  const SparkleIcon = sparkleIcons[sparkleIndex];

  // Cycle through sparkle icons
  useEffect(() => {
    const interval = setInterval(() => {
      setSparkleIndex((prev) => (prev + 1) % sparkleIcons.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50 mb-8">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* Animated logo container */}
            <div className={`relative w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-soft transition-all duration-500 ${isHovered ? 'rotate-6 scale-110 glow' : ''}`}>
              <Users className={`w-6 h-6 text-primary-foreground transition-transform duration-500 ${isHovered ? 'scale-110' : ''}`} />
              
              {/* Orbiting particle */}
              <div className={`absolute w-3 h-3 rounded-full bg-pastel-pink transition-all duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`} 
                style={{ 
                  animation: isHovered ? 'spin-slow 2s linear infinite' : 'none',
                  transformOrigin: '24px 24px',
                  left: '50%',
                  top: '-6px',
                  marginLeft: '-6px'
                }} 
              />
            </div>
            
            <div>
              <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <span className={`transition-all duration-300 ${isHovered ? 'gradient-text' : ''}`}>
                  Contact Manager
                </span>
                <SparkleIcon 
                  key={sparkleIndex}
                  className="w-5 h-5 text-primary animate-bounce-in" 
                  style={{ animationDuration: '0.3s' }}
                />
              </h1>
              <p className={`text-sm text-muted-foreground transition-all duration-300 ${isHovered ? 'translate-x-1' : ''}`}>
                Keep your friends close! ✨
              </p>
            </div>
          </div>

          {!showForm && (
            <Button
              variant="playful"
              onClick={onToggleForm}
              className="gap-2 group/btn relative overflow-hidden"
            >
              {/* Animated background gradient */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary via-chart-2 to-primary bg-[length:200%_100%] animate-gradient-shift opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
              
              <UserPlus className="w-5 h-5 relative z-10 transition-transform duration-300 group-hover/btn:rotate-12 group-hover/btn:scale-110" />
              <span className="relative z-10">Add Contact</span>
              
              {/* Sparkle effects on hover */}
              <Sparkles className="w-4 h-4 absolute right-2 top-1 text-primary-foreground/50 opacity-0 group-hover/btn:opacity-100 animate-bounce-subtle transition-opacity duration-300" />
            </Button>
          )}
        </div>
      </div>
      
      {/* Animated border gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary/50 to-transparent animate-gradient-shift bg-[length:200%_100%]" />
    </header>
  );
}
