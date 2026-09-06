type TerrainGemProps = {
  variant?: "cluster" | "shard" | "pair";
  className?: string;
};

/** A small piece of the landscape. These facets never request a canvas or a frame. */
export function TerrainGem({ variant = "cluster", className = "" }: TerrainGemProps) {
  return (
    <span className={`terrain-gem terrain-gem--${variant} ${className}`.trim()} aria-hidden="true">
      <svg viewBox="0 0 300 400" fill="none" focusable="false" aria-hidden="true">
        {variant === "shard" ? <g>
          <path className="terrain-gem__shade" d="M77 126 166 24 222 144 201 337 132 380 88 298Z" />
          <path className="terrain-gem__light" d="M77 126 166 24 145 149Z" />
          <path className="terrain-gem__face" d="M166 24 222 144 145 149Z" />
          <path className="terrain-gem__face" d="M77 126 145 149 132 380 88 298Z" />
          <path className="terrain-gem__mid" d="M145 149 222 144 201 337 132 380Z" />
          <path className="terrain-gem__glint" d="M145 149 151 147 136 368 132 380Z" />
        </g> : variant === "pair" ? <g>
          <path className="terrain-gem__shade" d="M165 141 240 72 266 170 224 348 159 360Z" />
          <path className="terrain-gem__light" d="M165 141 240 72 215 173Z" />
          <path className="terrain-gem__face" d="M240 72 266 170 215 173Z" />
          <path className="terrain-gem__mid" d="M165 141 215 173 191 357 159 360Z" />
          <path className="terrain-gem__face" d="M215 173 266 170 224 348 191 357Z" />
          <path className="terrain-gem__shade" d="M42 120 110 31 164 138 171 342 124 374 71 334Z" />
          <path className="terrain-gem__light" d="M42 120 110 31 105 145Z" />
          <path className="terrain-gem__face" d="M110 31 164 138 105 145Z" />
          <path className="terrain-gem__face" d="M42 120 105 145 124 374 71 334Z" />
          <path className="terrain-gem__mid" d="M105 145 164 138 171 342 124 374Z" />
          <path className="terrain-gem__glint" d="M105 145 110 145 128 369 124 374Z" />
        </g> : <g>
          <path className="terrain-gem__shade" d="M170 140 222 76 251 158 219 348 159 366Z" />
          <path className="terrain-gem__light" d="M170 140 222 76 210 167Z" />
          <path className="terrain-gem__face" d="M222 76 251 158 210 167Z" />
          <path className="terrain-gem__mid" d="M210 167 251 158 219 348 182 359Z" />
          <path className="terrain-gem__shade" d="M55 200 44 112 106 175 143 355 89 344Z" />
          <path className="terrain-gem__light" d="M44 112 79 204 55 200Z" />
          <path className="terrain-gem__face" d="M44 112 106 175 79 204Z" />
          <path className="terrain-gem__mid" d="M79 204 106 175 143 355 115 361Z" />
          <path className="terrain-gem__shade" d="M100 129 153 24 189 143 182 355 145 374 112 342Z" />
          <path className="terrain-gem__light" d="M100 129 153 24 148 151Z" />
          <path className="terrain-gem__face" d="M153 24 189 143 148 151Z" />
          <path className="terrain-gem__face" d="M100 129 148 151 145 374 112 342Z" />
          <path className="terrain-gem__mid" d="M148 151 189 143 182 355 145 374Z" />
          <path className="terrain-gem__glint" d="M148 151 153 150 149 369 145 374Z" />
          <path className="terrain-gem__shade" d="M196 257 249 201 265 269 221 361 169 372Z" />
          <path className="terrain-gem__light" d="M196 257 249 201 231 273Z" />
          <path className="terrain-gem__face" d="M249 201 265 269 231 273Z" />
          <path className="terrain-gem__mid" d="M231 273 265 269 221 361 200 367Z" />
          <path className="terrain-gem__face" d="M81 345 131 332 184 346 226 352 201 376 143 388 98 373Z" />
          <path className="terrain-gem__shade" d="M143 364 226 352 201 376 143 388 98 373Z" />
        </g>}
      </svg>
    </span>
  );
}
