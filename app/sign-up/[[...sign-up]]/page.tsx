import { SignUp } from '@clerk/nextjs'

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#030a0f]">
      <div className="relative">
        <div className="absolute -inset-4 rounded-2xl" style={{
          background: 'radial-gradient(ellipse at center, rgba(0,212,255,0.08) 0%, transparent 70%)'
        }} />
        <SignUp
          appearance={{
            variables: {
              colorPrimary: '#00d4ff',
              colorBackground: '#060f17',
              colorText: '#b8e4f5',
              colorTextSecondary: '#3d6880',
              colorInputBackground: '#081420',
              colorInputText: '#b8e4f5',
              borderRadius: '2px',
            },
            elements: {
              card: 'border border-[#0ff2] shadow-none',
              headerTitle: 'font-mono tracking-widest text-[#00d4ff]',
              formButtonPrimary: 'bg-transparent border border-[#00d4ff] text-[#00d4ff] hover:bg-[#00d4ff] hover:text-black font-mono tracking-widest uppercase text-xs',
              footerActionLink: 'text-[#00d4ff]',
            }
          }}
        />
      </div>
    </div>
  )
}
