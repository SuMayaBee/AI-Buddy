import { forwardRef } from 'react';

interface VideoProps extends React.HTMLProps<HTMLVideoElement> {
  className?: string;
}

const Video = forwardRef<HTMLVideoElement, VideoProps>(({ className, ...props }, ref) => (
  <div className="w-full">
    <video 
      playsInline 
      autoPlay 
      ref={ref}
      className={className || "rounded-lg w-full h-full"}
      {...props}
    />
  </div>
));

Video.displayName = 'Video';

export { Video };