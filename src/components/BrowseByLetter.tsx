"use client";

import React from "react";
import Link from "next/link";

const letters = [
  "0-9", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L",
  "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"
];

export default function BrowseByLetter() {
  return (
    <div className="my-8 p-5 rounded-2xl bg-[#0b0d14] border border-white/8">
      <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-3">
        Browse by Letter
      </h4>
      <div className="az-grid-pro">
        {letters.map((l) => (
          <Link
            key={l}
            href={`/search?letter=${l}`}
            className="az-link-pro"
          >
            {l}
          </Link>
        ))}
      </div>
    </div>
  );
}
