import { Suspense } from "react"
import { ProcoreEntry } from "@/app/procore/ProcoreEntry"
import { ProcoreLoadingState } from "@/app/procore/ProcoreLoadingState"

export default function ProcorePage() {
  return (
    <Suspense fallback={<ProcoreLoadingState label="Loading Procore…" />}>
      <ProcoreEntry />
    </Suspense>
  )
}
