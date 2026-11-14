import { cn } from '@/lib/utils'

type SectionHeadingProps = {
  eyebrow: string
  title: string
  description?: string
  titleAs?: 'h1' | 'h2'
  id?: string
  className?: string
  titleClassName?: string
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  titleAs = 'h2',
  id,
  className,
  titleClassName,
}: SectionHeadingProps) {
  const Title = titleAs

  return (
    <div className={cn('max-w-2xl', className)}>
      <p className="text-xs font-medium uppercase tracking-[0.12em] text-text-3">
        {eyebrow}
      </p>
      <Title
        id={id}
        className={cn(
          'mt-3 text-[clamp(1.875rem,3vw,2.75rem)] font-medium leading-[1.12] tracking-[-0.022em] text-white',
          titleClassName
        )}
      >
        {title}
      </Title>
      {description ? (
        <p className="mt-4 max-w-xl text-base leading-relaxed text-text-2">{description}</p>
      ) : null}
    </div>
  )
}
