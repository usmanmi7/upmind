"use client"

import { useState, useMemo, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import {
  Sparkles,
  X,
  Plus,
  ArrowRight,
  AlertCircle,
  TrendingUp,
  Lightbulb,
  Users,
  Calendar,
  Brain,
  CheckCircle2,
  Zap,
} from "lucide-react"
import { matchInnovations } from "@/lib/solve-them"
import type { InnovationMatchResult } from "@/lib/solve-them"
import type { DifficultyLevel } from "@/lib/solve-them/types"

const COMMON_SKILLS = [
  "Python",
  "JavaScript",
  "TypeScript",
  "React",
  "Node.js",
  "PyTorch",
  "TensorFlow",
  "Machine Learning",
  "Computer Vision",
  "NLP",
  "Rust",
  "Go",
  "C++",
  "Embedded Systems",
  "Robotics",
  "Mechanical Engineering",
  "Electrical Engineering",
  "Materials Science",
  "Chemical Engineering",
  "Biotechnology",
  "Aerospace",
  "Quantum Physics",
  "Cryptography",
  "Distributed Systems",
  "Cloud Infrastructure",
  "Mobile Development",
  "GIS",
  "Remote Sensing",
  "Hardware Design",
  "Manufacturing",
]

const COMMON_INTERESTS = [
  "AI",
  "Climate",
  "Healthcare",
  "Education",
  "Energy",
  "Space",
  "Robotics",
  "Biotech",
  "Quantum",
  "Cybersecurity",
  "Agriculture",
  "Water",
  "Mental Health",
  "Poverty",
  "Disaster Response",
  "Ocean",
  "Biodiversity",
  "Waste",
  "Housing",
  "Transportation",
  "Financial Inclusion",
  "Accessibility",
  "Materials",
  "Urban Planning",
]

export default function InnovationEnginePage() {
  const searchParams = useSearchParams()
  const problemFilter = searchParams.get("problem")

  const [skills, setSkills] = useState<string[]>(["Python", "Machine Learning"])
  const [interests, setInterests] = useState<string[]>(["AI", "Climate"])
  const [skillInput, setSkillInput] = useState("")
  const [interestInput, setInterestInput] = useState("")
  const [timeCommitment, setTimeCommitment] = useState<number>(12)
  const [teamSize, setTeamSize] = useState<number>(5)
  const [difficulty, setDifficulty] = useState<DifficultyLevel | "ANY">("ANY")
  const [hasRun, setHasRun] = useState(false)

  const matches = useMemo(
    () =>
      matchInnovations({
        skills,
        interests,
        timeCommitmentMonths: timeCommitment,
        teamSize,
        difficultyPreference: difficulty,
      }),
    [skills, interests, timeCommitment, teamSize, difficulty]
  )

  useEffect(() => {
    if (problemFilter) setHasRun(true)
  }, [problemFilter])

  const filteredMatches = useMemo(() => {
    if (!problemFilter) return matches
    return matches.filter((m) => m.problem.slug === problemFilter)
  }, [matches, problemFilter])

  const addSkill = (skill: string) => {
    const trimmed = skill.trim()
    if (trimmed && !skills.some((s) => s.toLowerCase() === trimmed.toLowerCase())) {
      setSkills([...skills, trimmed])
    }
    setSkillInput("")
  }

  const removeSkill = (skill: string) => {
    setSkills(skills.filter((s) => s !== skill))
  }

  const addInterest = (interest: string) => {
    const trimmed = interest.trim()
    if (trimmed && !interests.some((i) => i.toLowerCase() === trimmed.toLowerCase())) {
      setInterests([...interests, trimmed])
    }
    setInterestInput("")
  }

  const removeInterest = (interest: string) => {
    setInterests(interests.filter((i) => i !== interest))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#3B82F6] to-[#1E3A8A] flex items-center justify-center">
              <Lightbulb className="w-5 h-5 text-white" />
            </div>
            AI Innovation Engine
          </h1>
          <p className="text-muted-foreground mt-2 max-w-2xl">
            Tell us your skills and what you care about. We&apos;ll match you to world problems
            you&apos;re uniquely positioned to solve.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-5">
          <div className="p-5 rounded-2xl bg-card border shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <Brain className="w-5 h-5 text-[#1E3A8A]" />
              <h3 className="font-bold text-foreground">Your Skills</h3>
            </div>

            <div className="flex flex-wrap gap-2 mb-3 min-h-[2rem]">
              {skills.map((s) => (
                <span
                  key={s}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#3B82F6]/10 text-[#1E3A8A] border border-[#3B82F6]/30 text-sm"
                >
                  {s}
                  <button
                    onClick={() => removeSkill(s)}
                    className="ml-1 hover:text-foreground"
                    aria-label={`Remove ${s}`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              {skills.length === 0 && (
                <span className="text-sm text-muted-foreground">No skills added yet.</span>
              )}
            </div>

            <div className="flex gap-2">
              <input
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    addSkill(skillInput)
                  }
                }}
                placeholder="Type a skill and press Enter"
                className="flex-1 px-3 py-2 text-sm bg-background border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/50"
              />
              <button
                onClick={() => addSkill(skillInput)}
                className="px-3 py-2 rounded-lg bg-[#3B82F6]/10 text-[#1E3A8A] hover:bg-[#3B82F6]/20 border border-[#3B82F6]/30"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-3 flex flex-wrap gap-1.5">
              {COMMON_SKILLS.filter(
                (s) => !skills.some((x) => x.toLowerCase() === s.toLowerCase())
              )
                .slice(0, 10)
                .map((s) => (
                  <button
                    key={s}
                    onClick={() => addSkill(s)}
                    className="text-xs px-2 py-1 rounded-md bg-muted text-muted-foreground border hover:bg-accent hover:text-foreground transition-colors"
                  >
                    + {s}
                  </button>
                ))}
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-card border shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-[#1E3A8A]" />
              <h3 className="font-bold text-foreground">Your Interests</h3>
            </div>

            <div className="flex flex-wrap gap-2 mb-3 min-h-[2rem]">
              {interests.map((i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-sm"
                >
                  {i}
                  <button
                    onClick={() => removeInterest(i)}
                    className="ml-1 hover:text-foreground"
                    aria-label={`Remove ${i}`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              {interests.length === 0 && (
                <span className="text-sm text-muted-foreground">No interests added yet.</span>
              )}
            </div>

            <div className="flex gap-2">
              <input
                value={interestInput}
                onChange={(e) => setInterestInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    addInterest(interestInput)
                  }
                }}
                placeholder="Type an interest and press Enter"
                className="flex-1 px-3 py-2 text-sm bg-background border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/50"
              />
              <button
                onClick={() => addInterest(interestInput)}
                className="px-3 py-2 rounded-lg bg-[#3B82F6]/10 text-[#1E3A8A] hover:bg-[#3B82F6]/20 border border-[#3B82F6]/30"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-3 flex flex-wrap gap-1.5">
              {COMMON_INTERESTS.filter(
                (i) => !interests.some((x) => x.toLowerCase() === i.toLowerCase())
              )
                .slice(0, 10)
                .map((i) => (
                  <button
                    key={i}
                    onClick={() => addInterest(i)}
                    className="text-xs px-2 py-1 rounded-md bg-muted text-muted-foreground border hover:bg-accent hover:text-foreground transition-colors"
                  >
                    + {i}
                  </button>
                ))}
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-card border shadow-sm space-y-4">
            <div className="flex items-center gap-2 mb-1">
              <Zap className="w-5 h-5 text-[#1E3A8A]" />
              <h3 className="font-bold text-foreground">Constraints</h3>
            </div>

            <div>
              <label className="text-sm text-muted-foreground flex items-center justify-between mb-1">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  Time commitment
                </span>
                <span className="text-[#1E3A8A] font-medium">{timeCommitment} months</span>
              </label>
              <input
                type="range"
                min={1}
                max={60}
                value={timeCommitment}
                onChange={(e) => setTimeCommitment(Number(e.target.value))}
                className="w-full accent-[#3B82F6]"
              />
            </div>

            <div>
              <label className="text-sm text-muted-foreground flex items-center justify-between mb-1">
                <span className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5" />
                  Team size
                </span>
                <span className="text-[#1E3A8A] font-medium">{teamSize} engineers</span>
              </label>
              <input
                type="range"
                min={1}
                max={30}
                value={teamSize}
                onChange={(e) => setTeamSize(Number(e.target.value))}
                className="w-full accent-[#3B82F6]"
              />
            </div>

            <div>
              <label className="text-sm text-muted-foreground block mb-1">Difficulty preference</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as DifficultyLevel | "ANY")}
                className="w-full px-3 py-2 bg-background border rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/50"
              >
                <option value="ANY">Any difficulty</option>
                <option value="EASY">Easy</option>
                <option value="MEDIUM">Medium</option>
                <option value="HARD">Hard</option>
                <option value="EXTREME">Frontier</option>
              </select>
            </div>
          </div>

          <button
            onClick={() => setHasRun(true)}
            className="w-full px-5 py-3 rounded-xl bg-[#3B82F6] text-white font-semibold hover:bg-[#2563EB] transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            <Sparkles className="w-4 h-4" />
            Generate Innovations
          </button>
        </div>

        <div className="lg:col-span-2">
          {!hasRun ? (
            <div className="h-full flex items-center justify-center p-12 rounded-2xl bg-card border border-dashed text-center shadow-sm">
              <div>
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#DBEAFE] mb-4">
                  <Lightbulb className="w-7 h-7 text-[#1E3A8A]" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">
                  Your matches will appear here
                </h3>
                <p className="text-muted-foreground max-w-md">
                  Add your skills and interests, then click &quot;Generate Innovations&quot;. We&apos;ll
                  match you to problems where you can have the most impact.
                </p>
              </div>
            </div>
          ) : filteredMatches.length === 0 ? (
            <div className="h-full flex items-center justify-center p-12 rounded-2xl bg-card border border-dashed text-center shadow-sm">
              <div>
                <AlertCircle className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-foreground mb-2">No matches found</h3>
                <p className="text-muted-foreground">Try adding more skills or broadening your interests.</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-foreground">
                  {problemFilter ? "Your match score" : `${filteredMatches.length} problems matched`}
                </h3>
                <span className="text-sm text-muted-foreground">Sorted by match score</span>
              </div>

              {filteredMatches.map((m) => (
                <MatchCard key={m.problem.slug} match={m} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function MatchCard({ match }: { match: InnovationMatchResult }) {
  const { problem, matchScore, matchedSkills, reasonHighlights } = match
  const scoreColor =
    matchScore >= 70
      ? "text-emerald-600"
      : matchScore >= 40
      ? "text-amber-600"
      : "text-rose-600"

  return (
    <Link
      href={`/solve-them/${problem.slug}`}
      className="block p-5 rounded-2xl bg-card border shadow-sm hover:border-[#3B82F6]/40 hover:shadow-md transition-all"
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 text-center">
          <div className={`text-3xl font-bold ${scoreColor}`}>{matchScore}</div>
          <div className="text-xs text-muted-foreground">match</div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div>
              <div className="text-xs text-[#1E3A8A] font-medium mb-1">{problem.category}</div>
              <h4 className="text-lg font-bold text-foreground">{problem.title}</h4>
            </div>
            <ArrowRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
          </div>

          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{problem.summary}</p>

          <div className="space-y-1 mb-3">
            {reasonHighlights.map((r, i) => (
              <div key={i} className="flex items-start gap-2 text-sm text-foreground/80">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#1E3A8A] flex-shrink-0 mt-0.5" />
                <span>{r}</span>
              </div>
            ))}
          </div>

          {matchedSkills.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {matchedSkills.slice(0, 5).map((s) => (
                <span
                  key={s}
                  className="text-xs px-2 py-0.5 rounded-md bg-[#3B82F6]/10 text-[#1E3A8A] border border-[#3B82F6]/30"
                >
                  {s}
                </span>
              ))}
            </div>
          )}

          <div className="flex items-center gap-4 text-xs text-muted-foreground pt-3 border-t">
            <span className="flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-emerald-600" />
              Impact {problem.impactScore}
            </span>
            <span className="flex items-center gap-1">
              <Lightbulb className="w-3 h-3 text-amber-600" />
              Innovation {problem.innovationScore}
            </span>
            <span className="flex items-center gap-1">
              <AlertCircle className="w-3 h-3 text-rose-600" />
              Severity {problem.severity}
            </span>
            {problem.estimatedTimelineMonths && (
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {problem.estimatedTimelineMonths}mo
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
