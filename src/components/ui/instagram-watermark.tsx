"use client";

import { useState } from "react";

const AVATAR_CDN =
  "https://scontent-cgk1-2.cdninstagram.com/v/t51.82787-19/772839787_18039769745811334_957229611894436544_n.jpg?stp=dst-jpg_s150x150_tt6&_nc_cat=111&ccb=7-5&_nc_sid=f7ccc5&efg=eyJ2ZW5jb2RlX3RhZyI6InByb2ZpbGVfcGljLnd3dy4xMDgwLkMzIn0%3D&_nc_ohc=Syfv5WjQxJkQ7kNvwEhwdvU&_nc_oc=AdqwreC9Kd6LeVdsPXeUSg1n-pWeb8kcQHT_OYyiPE_RXSYoSvKd1kLqGoZbr5iGvms&_nc_zt=24&_nc_ht=scontent-cgk1-2.cdninstagram.com&_nc_gid=E8EInG100XTqwR2v04zxPQ&_nc_ss=7baaf&oh=00_AQLfCRQBzn_lJisUkBDEts7aAa-ew8orKHjGX1-er92NfQ&oe=6AA5E415";

function InstagramIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <rect x="2" y="2" width="20" height="20" rx="6" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  );
}

function GithubIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2Z" />
    </svg>
  );
}

type Props = {
  fixed?: boolean;
  className?: string;
};

export function InstagramWatermark({ fixed = false, className = "" }: Props) {
  const [imgError, setImgError] = useState(false);

  // pill: capsule compact 34-38px height
  const pill = (
    <a
      href="https://www.instagram.com/bdn_bnj"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Buka profil Instagram Bondan Banuaji @bdn_bnj"
      className="inline-flex items-center gap-2 rounded-full bg-[#1e1e1e] border border-white/[0.08] pl-1 pr-3 py-1 shadow-[0_2px_12px_rgba(0,0,0,0.4)] hover:bg-[#252525] hover:border-white/15 transition-colors duration-200 h-[36px]"
    >
      {/* avatar */}
      <span className="relative shrink-0">
        {!imgError ? (
          <img
            src={AVATAR_CDN}
            alt="Foto profil Instagram Bondan Banuaji"
            width={28}
            height={28}
            className="h-[28px] w-[28px] rounded-full object-cover bg-[#111] border border-white/10"
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
          />
        ) : (
          <span
            aria-hidden
            className="grid h-[28px] w-[28px] place-items-center rounded-full bg-gradient-to-br from-[#d50032] to-[#ff3d2e] text-[11px] font-black leading-none text-white border border-white/10"
          >
            BB
          </span>
        )}
      </span>

      {/* name */}
      <span className="text-[13px] font-medium tracking-tight text-white leading-none whitespace-nowrap">Bondan Banuaji</span>
      {/* username muted */}
      <span className="text-[12px] font-normal text-white/45 leading-none whitespace-nowrap">@bdn_bnj</span>

      {/* Instagram icon di kanan pill */}
      <span className="ml-1 flex items-center border-l border-white/10 pl-2.5">
        <InstagramIcon className="h-[16px] w-[16px] text-white/70" />
      </span>
    </a>
  );

  const github = (
    <a
      href="https://github.com/bondanbanuaji/nimeskuy"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Buka repository GitHub nimeskuy"
      className="grid h-9 w-9 place-items-center rounded-full bg-[#1e1e1e] border border-white/[0.08] text-white/70 hover:text-white hover:bg-[#252525] hover:border-white/15 transition-colors"
    >
      <GithubIcon className="h-[18px] w-[18px]" />
    </a>
  );

  const content = (
    <>
      <span className="text-[13px] font-normal text-white/70 whitespace-nowrap">Development by</span>
      {pill}
      {github}
    </>
  );

  if (fixed) {
    return (
      <div className={`fixed bottom-3 right-3 z-40 flex items-center gap-2 sm:bottom-4 sm:right-5 ${className}`.trim()}>{content}</div>
    );
  }

  return <div className={`inline-flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 ${className}`.trim()}>{content}</div>;
}
