import regexpANSIOriginal from "https://esm.sh/ansi-regex@^6.1.0";
import regexpURLOriginal from "https://esm.sh/url-regex-safe@^4.0.0";
const regexpANSIGlobal = new RegExp(regexpANSIOriginal().source, "gu");
const regexpEmojiExact = /^\p{Emoji}+$/v;
const regexpURLGlobal = new RegExp(regexpURLOriginal().source, "gu");
export interface StringDissectorOptions {
	/**
	 * The locales to use in the operation. The JavaScript implementation examines locales, and then computes a locale it understands that comes closest to satisfying the expressed preference. By default, the implementation's default locale will be used.
	 * 
	 * For more information, please visit https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl#locales_argument.
	 */
	locales?: Intl.LocalesArgument;
	/**
	 * Whether to prevent URLs get splitted.
	 * @default {true}
	 */
	safeURLs?: boolean;
	/**
	 * Whether to prevent words get splitted.
	 * @default {true}
	 */
	safeWords?: boolean;
}
export type StringSegmentType = "ansi" | "character" | "emoji" | "url" | "word";
export interface StringSegmentDescriptor {
	/**
	 * Type of the string segment.
	 */
	type: StringSegmentType;
	/**
	 * Value of the string segment.
	 */
	value: string;
}
export interface StringSegmentDescriptorExtend extends StringSegmentDescriptor {
	/**
	 * String segment end index of the input string.
	 */
	indexEnd: number;
	/**
	 * String segment start index of the input string.
	 */
	indexStart: number;
}
interface DissectorRegExpEntry {
	matcher: RegExp;
	matcherType: StringSegmentType;
}
function* dissectorWithRegExp(item: string, matchersEntry: DissectorRegExpEntry[]): Generator<string | StringSegmentDescriptor> {
	const [{
		matcher,
		matcherType
	}, ...matchersEntryRemain] = matchersEntry;
	let cursor: number = 0;
	for (const match of item.matchAll(matcher)) {
		const value: string = match[0];
		const indexStart: number = match.index;
		if (cursor < indexStart) {
			const segment: string = item.slice(cursor, indexStart);
			if (matchersEntryRemain.length > 0) {
				yield* dissectorWithRegExp(segment, matchersEntryRemain);
			} else {
				yield segment;
			}
		}
		yield {
			type: matcherType,
			value
		};
		cursor = indexStart + value.length;
	}
	if (cursor < item.length) {
		const segment: string = item.slice(cursor, item.length);
		if (matchersEntryRemain.length > 0) {
			yield* dissectorWithRegExp(segment, matchersEntryRemain);
		} else {
			yield segment;
		}
	}
}
/**
 * String dissector to dissect the string; Safe with the emojis, URLs, and words.
 */
export class StringDissector {
	#safeURLs: boolean;
	#segmenter: Intl.Segmenter;
	/**
	 * Initialize string dissector.
	 * @param {StringDissectorOptions} [options={}] Options.
	 */
	constructor(options: StringDissectorOptions = {}) {
		const {
			locales,
			safeURLs = true,
			safeWords = true
		}: StringDissectorOptions = options;
		this.#safeURLs = safeURLs;
		this.#segmenter = new Intl.Segmenter(locales, { granularity: safeWords ? "word" : "grapheme" });
	}
	/**
	 * Dissect the string.
	 * @param {string} item String that need to dissect.
	 * @returns {Generator<StringSegmentDescriptor>} A dissected string with descriptor.
	 */
	*dissect(item: string): Generator<StringSegmentDescriptor> {
		const matchersEntry: DissectorRegExpEntry[] = [{
			matcher: regexpANSIGlobal,
			matcherType: "ansi"
		}];
		if (this.#safeURLs) {
			matchersEntry.push({
				matcher: regexpURLGlobal,
				matcherType: "url"
			});
		}
		for (const segmentWithRegExp of dissectorWithRegExp(item, matchersEntry)) {
			if (typeof segmentWithRegExp !== "string") {
				yield segmentWithRegExp;
				continue;
			}
			for (const {
				isWordLike,
				segment
			} of this.#segmenter.segment(segmentWithRegExp)) {
				if (regexpEmojiExact.test(segment)) {
					yield {
						type: "emoji",
						value: segment
					};
					continue;
				}
				yield {
					type: isWordLike ? "word" : "character",
					value: segment
				};
			}
		}
	}
	/**
	 * Dissect the string with extend information.
	 * @param {string} item String that need to dissect.
	 * @returns {Generator<StringSegmentDescriptorExtend>} A dissected string with extend descriptor.
	 */
	*dissectExtend(item: string): Generator<StringSegmentDescriptorExtend> {
		let cursor: number = 0;
		for (const segment of this.dissect(item)) {
			const segmentValueLength: number = segment.value.length;
			yield {
				...segment,
				indexEnd: cursor + segmentValueLength,
				indexStart: cursor
			};
			cursor += segmentValueLength;
		}
	}
}
export default StringDissector;
/**
 * Dissect the string; Safe with the emojis, URLs, and words.
 * @param {string} item String that need to dissect.
 * @param {StringDissectorOptions} [options={}] Options.
 * @returns {Generator<StringSegmentDescriptor>} A dissected string with descriptor.
 */
export function dissectString(item: string, options: StringDissectorOptions = {}): Generator<StringSegmentDescriptor> {
	return new StringDissector(options).dissect(item);
}
/**
 * Dissect the string with extend information; Safe with the emojis, URLs, and words.
 * @param {string} item String that need to dissect.
 * @param {StringDissectorOptions} [options={}] Options.
 * @returns {Generator<StringSegmentDescriptorExtend>} A dissected string with extend descriptor.
 */
export function dissectStringExtend(item: string, options: StringDissectorOptions = {}): Generator<StringSegmentDescriptorExtend> {
	return new StringDissector(options).dissectExtend(item);
}
