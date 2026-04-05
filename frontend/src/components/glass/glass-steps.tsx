"use client"

import React from "react"
import { cn } from "@/lib/utils"

export interface StepItem {
  label: string
}

export interface GlassStepsProps {
  steps: StepItem[]
  current: number // 0-indexed
  className?: string
}

// Checkmark icon for completed steps
function CheckIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
      <path d="M2.5 6.5L5.5 9.5L10.5 3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

type StepState = "done" | "active" | "pending"

function getStepState(index: number, current: number): StepState {
  if (index < current) return "done"
  if (index === current) return "active"
  return "pending"
}

const circleStyles: Record<StepState, React.CSSProperties> = {
  done: {
    background: "rgba(29,158,117,0.3)",
    border: "2px solid #1d9e75",
    color: "#5dcaa5",
  },
  active: {
    background: "rgba(127,119,221,0.3)",
    border: "2px solid #7f77dd",
    color: "#afa9ec",
  },
  pending: {
    background: "rgba(255,255,255,0.06)",
    border: "2px solid rgba(255,255,255,0.15)",
    color: "rgba(255,255,255,0.3)",
  },
}

const labelStyles: Record<StepState, React.CSSProperties> = {
  done: { color: "rgba(255,255,255,0.5)" },
  active: { color: "#afa9ec" },
  pending: { color: "rgba(255,255,255,0.5)" },
}

const lineStyles: Record<"done" | "pending", React.CSSProperties> = {
  done: { background: "rgba(29,158,117,0.4)" },
  pending: { background: "rgba(255,255,255,0.08)" },
}

export function GlassSteps({ steps, current, className }: GlassStepsProps) {
  return (
    <div
      role="list"
      className={cn("flex items-start", className)}
    >
      {steps.map((step, index) => {
        const state = getStepState(index, current)
        const isLast = index === steps.length - 1
        // Line is "done" if step is done (step behind current)
        const lineDone = index < current

        return (
          <div
            key={index}
            role="listitem"
            aria-current={state === "active" ? "step" : undefined}
            className="flex flex-col items-center flex-1 relative"
          >
            {/* Connector line (skip last) */}
            {!isLast && (
              <div
                style={{
                  position: "absolute",
                  top: 16,
                  left: "50%",
                  width: "100%",
                  height: 1,
                  ...(lineDone ? lineStyles.done : lineStyles.pending),
                }}
              />
            )}

            {/* Circle */}
            <div
              className="flex items-center justify-center shrink-0 relative z-10"
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                fontSize: 12,
                fontWeight: 500,
                ...circleStyles[state],
              }}
            >
              {state === "done" ? <CheckIcon /> : <span>{index + 1}</span>}
            </div>

            {/* Label */}
            <span
              className="mt-2 text-center leading-tight px-1"
              style={{ fontSize: 11, ...labelStyles[state] }}
            >
              {step.label}
            </span>
          </div>
        )
      })}
    </div>
  )
}
