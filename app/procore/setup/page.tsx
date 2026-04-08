import { Suspense } from "react"
import { ProcoreSetup } from "@/app/procore/setup/ProcoreSetup"
import { ProcoreLoadingState } from "@/app/procore/ProcoreLoadingState"

export default function ProcoreSetupPage() {
  return (
    <Suspense fallback={<ProcoreLoadingState label="Loading setup…" />}>
      <ProcoreSetup />
    </Suspense>
  )
}
