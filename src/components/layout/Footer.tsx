'use client';

interface FooterProps {
  authorName: string;
}

export default function Footer({ authorName }: FooterProps) {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">© Copyright 2026 {authorName}.</div>
    </footer>
  );
}
