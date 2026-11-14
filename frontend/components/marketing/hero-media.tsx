import { HeroCardCluster } from "@/components/marketing/hero-card-cluster";

/**
 * Swap point for a future licensed transparent hero photograph.
 * TODO(asset): if the owner supplies a licensed transparent PNG, render
 * next/image here instead of the cluster. Both occupy the same centre-right
 * mass, so the surrounding layout holds.
 */
export function HeroMedia() {
  return <HeroCardCluster />;
}
