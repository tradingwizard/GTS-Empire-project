type TBrandLogoProps = {
    width?: number;
    height?: number;
    fill?: string;
    className?: string;
    isMobile?: boolean;
};

export const BrandLogo = ({ className = '', isMobile = false }: TBrandLogoProps) => {
    const height = isMobile ? 24 : 28;

    return (
        <span
            className={`brand-logo ${className}`}
            style={{
                display: 'inline-flex',
                alignItems: 'baseline',
                gap: '0.42rem',
                fontFamily: "'Playfair Display', Georgia, serif",
                lineHeight: 1,
                height,
            }}
        >
            <span
                style={{
                    fontSize: `${height * 0.95}px`,
                    fontWeight: 700,
                    fontStyle: 'italic',
                    color: '#b91c1c',
                    letterSpacing: '-0.01em',
                }}
            >
                GTS
            </span>
            <span
                style={{
                    fontFamily: "'Manrope', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                    fontSize: `${height * 0.46}px`,
                    fontWeight: 700,
                    letterSpacing: '0.28em',
                    color: '#1a1413',
                }}
            >
                EMPIRE
            </span>
        </span>
    );
};
