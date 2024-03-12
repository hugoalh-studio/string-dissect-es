import regexpANSIOriginal from "https://esm.sh/ansi-regex@6.0.1";
import regexpURLOriginal from "https://esm.sh/url-regex-safe@4.0.0";
const regexpANSIGlobal = new RegExp(regexpANSIOriginal().source, "gu");
const regexpEmojiExact = /^\p{Emoji}+$/v;
const regexpURLGlobal = new RegExp(regexpURLOriginal().source, "gu");
export type StringDissectorLocales = ConstructorParameters<typeof Intl.Segmenter>[0];
export interface StringDissectorOptions {
	/**
	 * The locale(s) to use in the operation; The JavaScript implementation examines locales, and then computes a locale it understands that comes closest to satisfying the expressed preference. By default, the implementation's default locale will be used. For more information, please visit https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl#locales_argument.
	 * @default undefined
	 */
	locales?: StringDissectorLocales;
	/**
	 * Whether to remove ANSI escape codes.
	 * @default false
	 */
	removeANSI?: boolean;
	/**
	 * Whether to prevent URLs get splitted.
	 * @default true
	 */
	safeURLs?: boolean;
	/**
	 * Whether to prevent words get splitted.
	 * @default true
	 */
	safeWords?: boolean;
}
/**
 * Enum of string segment type.
 */
export enum StringSegmentType {
	ansi = "ansi",
	ANSI = "ansi",
	character = "character",
	Character = "character",
	emoji = "emoji",
	Emoji = "emoji",
	url = "url",
	Url = "url",
	URL = "url",
	word = "word",
	Word = "word"
}
/**
 * String segment descriptor.
 */
export interface StringSegmentDescriptor {
	type: StringSegmentType;
	value: string;
}
/**
 * String segment descriptor with extend information.
 */
export interface StringSegmentDescriptorExtend extends StringSegmentDescriptor {
	indexEnd: number;
	indexStart: number;
}
/**
 * @access private
 */
interface StringDissectSegmentByRegExpParameters {
	matcher: RegExp;
	segment: string;
	type: StringSegmentType;
}
/**
 * @access private
 * @param {StringDissectSegmentByRegExpParameters} param0
 * @returns {Generator<string | StringSegmentDescriptor>}
 */
function* dissectSegmentWithRegExp({ matcher, segment, type }: StringDissectSegmentByRegExpParameters): Generator<string | StringSegmentDescriptor> {
	let cursor = 0;
	for (const match of segment.matchAll(matcher)) {
		const value: string = match[0];
		const indexStart: number = match.index!;
		if (cursor < indexStart) {
			yield segment.slice(cursor, indexStart);
		}
		yield { type, value };
		cursor = indexStart + value.length;
	}
	if (cursor < segment.length) {
		yield segment.slice(cursor, segment.length);
	}
}
/**
 * String dissector to dissect the string; Safe with the emojis, URLs, and words.
 */
export class StringDissector {
	#locales?: StringDissectorLocales;
	#removeANSI: boolean;
	#safeURLs: boolean;
	#safeWords: boolean;
	/**
	 * Initialize string dissector.
	 * @param {StringDissectorOptions} [options={}] Options.
	 */
	constructor(options: StringDissectorOptions = {}) {
		this.#locales = options.locales;
		this.#removeANSI = options.removeANSI ?? false;
		this.#safeURLs = options.safeURLs ?? true;
		this.#safeWords = options.safeWords ?? true;
		void new Intl.Segmenter(this.#locales, { granularity: this.#safeWords ? "word" : "grapheme" });
	}
	/**
	 * Dissect the string.
	 * @param {string} item String that need to dissect.
	 * @param {StringDissectorOptions} [optionsOverride={}] Override the defined options.
	 * @returns {Generator<StringSegmentDescriptor>} A dissected string with descriptor.
	 */
	*dissect(item: string, optionsOverride: StringDissectorOptions = {}): Generator<StringSegmentDescriptor> {
		const locales: StringDissectorLocales = optionsOverride.locales ?? this.#locales;
		const removeANSI: boolean = optionsOverride.removeANSI ?? this.#removeANSI;
		const safeURLs: boolean = optionsOverride.safeURLs ?? this.#safeURLs;
		const safeWords: boolean = optionsOverride.safeWords ?? this.#safeWords;
		const segmenter: Intl.Segmenter = new Intl.Segmenter(locales, { granularity: safeWords ? "word" : "grapheme" });
		for (const segmentWithANSI of dissectSegmentWithRegExp({
			matcher: regexpANSIGlobal,
			segment: item,
			type: StringSegmentType.ANSI
		})) {
			if (typeof segmentWithANSI !== "string") {
				if (!removeANSI) {
					yield segmentWithANSI;
				}
				continue;
			}
			for (const segmentWithURL of (safeURLs ? dissectSegmentWithRegExp({
				matcher: regexpURLGlobal,
				segment: segmentWithANSI,
				type: StringSegmentType.URL
			}) : [segmentWithANSI])) {
				if (typeof segmentWithURL !== "string") {
					yield segmentWithURL;
					continue;
				}
				for (const { isWordLike, segment } of segmenter.segment(segmentWithURL)) {
					if (regexpEmojiExact.test(segment)) {
						yield {
							type: StringSegmentType.Emoji,
							value: segment
						};
						continue;
					}
					yield {
						type: isWordLike ? StringSegmentType.Word : StringSegmentType.Character,
						value: segment
					};
				}
			}
		}
	}
	/**
	 * Dissect the string with extend information.
	 * @param {string} item String that need to dissect.
	 * @param {StringDissectorOptions} [optionsOverride={}] Override the defined options.
	 * @returns {Generator<StringSegmentDescriptorExtend>} A dissected string with extend descriptor.
	 */
	*dissectExtend(item: string, optionsOverride: StringDissectorOptions = {}): Generator<StringSegmentDescriptorExtend> {
		const removeANSI: boolean = optionsOverride.removeANSI ?? this.#removeANSI;
		let cursor = 0;
		for (const segment of this.dissect(item, { ...optionsOverride, removeANSI: false })) {
			if (!(segment.type === StringSegmentType.ANSI && removeANSI)) {
				yield {
					...segment,
					indexEnd: cursor + segment.value.length,
					indexStart: cursor
				};
			}
			cursor += segment.value.length;
		}
	}
	/**
	 * Dissect the string; Safe with the emojis, URLs, and words.
	 * @param {string} item String that need to dissect.
	 * @param {StringDissectorOptions} [options={}] Options.
	 * @returns {Generator<StringSegmentDescriptor>} A dissected string with descriptor.
	 */
	static dissect(item: string, options: StringDissectorOptions = {}): Generator<StringSegmentDescriptor> {
		return new this(options).dissect(item);
	}
	/**
	 * Dissect the string with extend information; Safe with the emojis, URLs, and words.
	 * @param {string} item String that need to dissect.
	 * @param {StringDissectorOptions} [options={}] Options.
	 * @returns {Generator<StringSegmentDescriptorExtend>} A dissected string with extend descriptor.
	 */
	static dissectExtend(item: string, options: StringDissectorOptions = {}): Generator<StringSegmentDescriptorExtend> {
		return new this(options).dissectExtend(item);
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
export {
	/**
	 * @deprecated Renamed to `dissectString`.
	 */
	dissectString as stringDissect
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
export {
	/**
	 * @deprecated Renamed to `dissectStringExtend`.
	 */
	dissectStringExtend as stringDissectExtend
}
