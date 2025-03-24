import Image from "next/image"

interface ProfileCardProps {
  name: string
  role: string
  description: string
  imageUrl?: string
}

export function ProfileCard({ name, role, description, imageUrl }: ProfileCardProps) {
  return (
    <div className="flex items-start gap-6 rounded-lg border bg-card p-6 shadow-sm">
      <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-full bg-muted">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-12 w-12"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
        )}
      </div>
      <div className="flex-1 space-y-2">
        <div>
          <h3 className="text-lg font-semibold">{name}</h3>
          <p className="text-sm text-muted-foreground">{role}</p>
        </div>
        <p className="text-sm text-foreground/80">{description}</p>
      </div>
    </div>
  )
} 