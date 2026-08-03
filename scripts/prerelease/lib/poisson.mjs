/** P(X = k) for a Poisson(lambda) variable, via the stable iterative form. */
function poissonPmf(lambda, k) {
  let p = Math.exp(-lambda)
  for (let i = 1; i <= k; i++) p *= lambda / i
  return p
}

/** P(X >= k) for a Poisson(lambda) variable — used as a "probability of opening at least k support cards" approximation for rare-event pack draws. */
export function poissonAtLeast(lambda, k) {
  if (k <= 0) return 1
  let cdf = 0
  for (let i = 0; i < k; i++) cdf += poissonPmf(lambda, i)
  return Math.max(0, 1 - cdf)
}
