import { StringDissector } from "./mod.ts";
const sample1 = "Vel ex sit est sit est tempor enim et voluptua consetetur gubergren gubergren ut.";
const sample2 = "🤝💑💏👪👨‍👩‍👧‍👦👩‍👦👩‍👧‍👦🧑‍🤝‍🧑";
Deno.bench("1", { permissions: "none" }, () => {
	new StringDissector().dissectExtend(sample1);
});
Deno.bench("2", { permissions: "none" }, () => {
	new StringDissector().dissectExtend(sample2);
});
