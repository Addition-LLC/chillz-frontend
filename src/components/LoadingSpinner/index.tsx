interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'white' | 'black';
  className?: string;
}

export default function LoadingSpinner({ 
  size = 'md', 
  color = 'white',
  className = '' 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-8 h-8'
  };

  const colorClasses = {
    white: {
      outer: 'border-white/30',
      inner: 'border-transparent border-t-white'
    },
    black: {
      outer: 'border-black/30',
      inner: 'border-transparent border-t-black'
    }
  };

  return (
    <div className={`relative ${sizeClasses[size]} ${className}`}>
      <div className={`absolute inset-0 border-2 ${colorClasses[color].outer} rounded-full`}></div>
      <div className={`absolute inset-0 border-2 ${colorClasses[color].inner} rounded-full animate-spin`}></div>
    </div>
  );
}
