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
      <p className="text-[13px] font-medium text-text-3">{eyebrow}</p>
      <Title
        id={id}
        className={cn(
          'mt-2 font-sans text-[clamp(1.75rem,7vw,2.25rem)] font-medium leading-[1.15] tracking-[-0.02em] text-white md:text-[clamp(2rem,3vw,2.75rem)]',
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
