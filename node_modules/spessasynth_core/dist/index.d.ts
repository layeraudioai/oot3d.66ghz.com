//#region src/utils/indexed_array.d.ts
/**
 * Indexed_array.ts
 * purpose: extends Uint8Array with a currentIndex property.
 */
declare class IndexedByteArray extends Uint8Array {
  /**
   * The current index of the array.
   */
  currentIndex: number;
  /**
   * Returns a section of an array.
   * @param start The beginning of the specified portion of the array.
   * @param end The end of the specified portion of the array. This is exclusive of the element at the index 'end'.
   */
  slice(start?: number, end?: number): IndexedByteArray;
}
//#endregion
//#region src/utils/byte_functions/big_endian.d.ts
/**
 * Reads number as Big endian.
 * @param dataArray the array to read from.
 * @param bytesAmount the number of bytes to read.
 * @param offset the offset to start reading from.
 * @returns the number.
 */
declare function readBigEndian(dataArray: number[] | ArrayLike<number>, bytesAmount: number, offset?: number): number;
//#endregion
//#region src/utils/byte_functions/little_endian.d.ts
/**
 * Reads the number as little endian from an IndexedByteArray.
 * @param dataArray the array to read from.
 * @param bytesAmount the number of bytes to read.
 * @returns the number.
 */
declare function readLittleEndianIndexed(dataArray: IndexedByteArray, bytesAmount: number): number;
/**
 * Reads the number as little endian.
 * @param dataArray the array to read from.
 * @param bytesAmount the number of bytes to read.
 * @param offset the offset to start reading at.
 * @returns the number.
 */
declare function readLittleEndian(dataArray: number[] | ArrayLike<number>, bytesAmount: number, offset?: number): number;
//#endregion
//#region src/utils/byte_functions/string.d.ts
/**
 * Reads bytes as an ASCII string. This version works with any numeric array.
 * @param dataArray the array to read from.
 * @param bytes the amount of bytes to read.
 * @param offset the offset in the array to start reading from.
 * @returns the string.
 */
declare function readBinaryString(dataArray: ArrayLike<number>, bytes?: number, offset?: number): string;
/**
 * Reads bytes as an ASCII string from an IndexedByteArray.
 * @param dataArray the IndexedByteArray to read from.
 * @param bytes the amount of bytes to read.
 * @returns the string.
 */
declare function readBinaryStringIndexed(dataArray: IndexedByteArray, bytes: number): string;
//#endregion
//#region src/utils/byte_functions/variable_length_quantity.d.ts
/**
 * Reads VLQ from a MIDI byte array.
 * @param midiByteArray the array to read from.
 * @returns the number.
 */
declare function readVariableLengthQuantity(midiByteArray: IndexedByteArray): number;
//#endregion
//#region src/utils/write_wav.d.ts
/**
 * Writes an audio into a valid WAV file.
 * @param audioData the audio data channels.
 * @param sampleRate the sample rate, in Hertz.
 * @param options Additional options for writing the file.
 * @returns the binary file.
 */
declare function audioToWav(audioData: Float32Array[], sampleRate: number, options?: Partial<WaveWriteOptions>): ArrayBuffer;
//#endregion
//#region src/utils/loggin.d.ts
/**
 * Manage the log level of `spessasynth_core`.
 */
declare class SpessaLog {
  /**
   * The most verbose log level, prints out a lot of small details.
   */
  static infoEnabled: boolean;
  /**
   * The default log level, prints out warnings for unexpected and erroneous behavior.
   */
  static warnEnabled: boolean;
  /**
   * If grouping of the log messages is allowed. Recommended for the `info` verbosity level.
   */
  static groupEnabled: boolean;
  /**
   * The log functions that get called with the data.
   * By default, they use `console` object.
   *
   * This may be overridden to capture the spessasynth log data.
   */
  static logFunctions: {
    info: (...data: any[]) => void;
    warn: (...data: any[]) => void;
    group: (...data: any[]) => void;
    groupEnd: () => void;
    groupCollapsed: (...data: any[]) => void;
  };
  /**
   * Enables or disables logging.
   * @param enableInfo enables info.
   * @param enableWarn enables warning.
   * @param enableGroup enables groups.
   */
  static setLogLevel(enableInfo: boolean, enableWarn: boolean, enableGroup: boolean): void;
  static info(...message: unknown[]): void;
  static warn(...message: unknown[]): void;
  static group(...message: unknown[]): void;
  static groupCollapsed(...message: unknown[]): void;
  static groupEnd(): void;
}
//#endregion
//#region src/soundbank/basic_soundbank/generator_types.d.ts
/**
 * All SoundFont2 Generator enumerations.
 */
declare const GeneratorTypes: Readonly<{
  readonly invalid: -1;
  readonly startAddrsOffset: 0;
  readonly endAddrOffset: 1;
  readonly startloopAddrsOffset: 2;
  readonly endloopAddrsOffset: 3;
  readonly startAddrsCoarseOffset: 4;
  readonly modLfoToPitch: 5;
  readonly vibLfoToPitch: 6;
  readonly modEnvToPitch: 7;
  readonly initialFilterFc: 8;
  readonly initialFilterQ: 9;
  readonly modLfoToFilterFc: 10;
  readonly modEnvToFilterFc: 11;
  readonly endAddrsCoarseOffset: 12;
  readonly modLfoToVolume: 13;
  readonly chorusEffectsSend: 15;
  readonly reverbEffectsSend: 16;
  readonly pan: 17;
  readonly delayModLFO: 21;
  readonly freqModLFO: 22;
  readonly delayVibLFO: 23;
  readonly freqVibLFO: 24;
  readonly delayModEnv: 25;
  readonly attackModEnv: 26;
  readonly holdModEnv: 27;
  readonly decayModEnv: 28;
  readonly sustainModEnv: 29;
  readonly releaseModEnv: 30;
  readonly keyNumToModEnvHold: 31;
  readonly keyNumToModEnvDecay: 32;
  readonly delayVolEnv: 33;
  readonly attackVolEnv: 34;
  readonly holdVolEnv: 35;
  readonly decayVolEnv: 36;
  readonly sustainVolEnv: 37;
  readonly releaseVolEnv: 38;
  readonly keyNumToVolEnvHold: 39;
  readonly keyNumToVolEnvDecay: 40;
  readonly instrument: 41;
  readonly keyRange: 43;
  readonly velRange: 44;
  readonly startloopAddrsCoarseOffset: 45;
  readonly keyNum: 46;
  readonly velocity: 47;
  readonly initialAttenuation: 48;
  readonly endloopAddrsCoarseOffset: 50;
  readonly coarseTune: 51;
  readonly fineTune: 52;
  readonly sampleID: 53;
  readonly sampleModes: 54;
  readonly scaleTuning: 56;
  readonly exclusiveClass: 57;
  readonly overridingRootKey: 58;
  readonly endOper: 60;
  readonly amplitude: 61;
  readonly vibLfoRate: 62;
  readonly vibLfoAmplitudeDepth: 63;
  readonly vibLfoToFilterFc: 64;
  readonly modLfoRate: 65;
  readonly modLfoAmplitudeDepth: 66;
}>;
type GeneratorType = (typeof GeneratorTypes)[keyof typeof GeneratorTypes];
declare const MAX_GENERATOR: number;
declare const GENERATORS_AMOUNT: number;
interface GeneratorLimit {
  /**
   * Minimum value for this generator type.
   */
  min: number;
  /**
   * Maximum allowed value for this generator type.
   */
  max: number;
  /**
   * Default value for this generator type.
   */
  def: number;
  /**
   * SoundFont2 NRPN scale factor for this generator type.
   */
  nrpn: number;
}
/**
 * Min: minimum value, max: maximum value, def: default value, nrpn: nrpn scale
 */
declare const GeneratorLimits: Readonly<Record<GeneratorType, GeneratorLimit>>;
//#endregion
//#region src/soundbank/enums.d.ts
declare const SampleTypes: {
  readonly monoSample: 1;
  readonly rightSample: 2;
  readonly leftSample: 4;
  readonly linkedSample: 8;
  readonly romMonoSample: 32769;
  readonly romRightSample: 32770;
  readonly romLeftSample: 32772;
  readonly romLinkedSample: 32776;
};
type SampleType = (typeof SampleTypes)[keyof typeof SampleTypes];
declare const ModulatorControllerSources: {
  readonly noController: 0;
  readonly noteOnVelocity: 2;
  readonly noteOnKeyNum: 3;
  readonly polyPressure: 10;
  readonly channelPressure: 13;
  readonly pitchWheel: 14;
  readonly pitchWheelRange: 16;
  readonly link: 127;
};
type ModulatorControllerSource = (typeof ModulatorControllerSources)[keyof typeof ModulatorControllerSources];
declare const ModulatorCurveTypes: {
  readonly linear: 0;
  readonly concave: 1;
  readonly convex: 2;
  readonly switch: 3;
};
type ModulatorCurveType = (typeof ModulatorCurveTypes)[keyof typeof ModulatorCurveTypes];
declare const ModulatorTransformTypes: {
  readonly linear: 0;
  readonly absolute: 2;
};
type ModulatorTransformType = (typeof ModulatorTransformTypes)[keyof typeof ModulatorTransformTypes];
//#endregion
//#region src/synthesizer/audio_engine/voice/lowpass_filter.d.ts
declare class LowpassFilter {
  /**
   * For smoothing the filter cutoff frequency.
   */
  static smoothingConstant: number;
  /**
   * Cached coefficient calculations.
   * stored as cachedCoefficients[resonanceCb + currentInitialFc * 961].
   */
  private static cachedCoefficients;
  /**
   * Resonance in centibels.
   */
  resonanceCb: number;
  /**
   * Current cutoff frequency in absolute cents.
   */
  currentInitialFc: number;
  /**
   * Filter coefficient 1.
   */
  a0: number;
  /**
   * Filter coefficient 2.
   */
  a1: number;
  /**
   * Filter coefficient 3.
   */
  a2: number;
  /**
   * Filter coefficient 4.
   */
  a3: number;
  /**
   * Filter coefficient 5.
   */
  a4: number;
  /**
   * Input history 1.
   */
  x1: number;
  /**
   * Input history 2.
   */
  x2: number;
  /**
   * Output history 1.
   */
  y1: number;
  /**
   * Output history 2.
   */
  y2: number;
  /**
   * For tracking the last cutoff frequency in the apply method, absolute cents.
   * Set to infinity to force recalculation.
   */
  lastTargetCutoff: number;
  /**
   * Used for tracking if the filter has been initialized.
   */
  initialized: boolean;
  /**
   * Filter's sample rate in Hz.
   */
  private readonly sampleRate;
  /**
   * Maximum cutoff frequency in Hz.
   * This is used to prevent aliasing and ensure the filter operates within the valid frequency range.
   */
  private readonly maxCutoff;
  /**
   * Initializes a new instance of the filter.
   * @param sampleRate the sample rate of the audio engine in Hz.
   */
  constructor(sampleRate: number);
  static initCache(sampleRate: number): void;
  init(): void;
  /**
   * Calculates the filter coefficients based on the current resonance and cutoff frequency and caches them.
   * @param cutoffCents The cutoff frequency in cents.
   */
  calculateCoefficients(cutoffCents: number): void;
}
//#endregion
//#region src/synthesizer/audio_engine/voice/volume_envelope.d.ts
/**
 * VOL ENV STATES:
 * 0 - delay
 * 1 - attack
 * 2 - hold/peak
 * 3 - decay
 * 4 - sustain
 * release indicates by isInRelease property
 */
type VolumeEnvelopeState = 0 | 1 | 2 | 3 | 4;
declare class VolumeEnvelope {
  /**
   * The target gain for the current rendering block.
   */
  outputGain: number;
  /**
   * The current attenuation of the envelope in cB.
   */
  attenuationCb: number;
  /**
   * The current stage of the volume envelope.
   */
  state: VolumeEnvelopeState;
  /**
   * The sample rate in Hz.
   */
  private readonly sampleRate;
  /**
   * The sample count between updates of the volume envelope.
   * Since the volume envelope calculation runs once per rendering quantum,
   * this effectively the buffer size.
   */
  private readonly updateInterval;
  /**
   * The envelope's current time in samples.
   */
  private sampleTime;
  /**
   * The dB attenuation of the envelope when it entered the release stage.
   */
  private releaseStartCb;
  /**
   * The time in samples relative to the start of the envelope.
   */
  private releaseStartTimeSamples;
  /**
   * The attack duration in samples.
   */
  private attackDuration;
  /**
   * The decay duration in samples.
   */
  private decayDuration;
  /**
   * The release duration in samples.
   */
  private releaseDuration;
  /**
   * The voice's sustain amount in cB.
   */
  private sustainCb;
  /**
   * The time in samples to the end of delay stage, relative to the start of the envelope.
   */
  private delayEnd;
  /**
   * The time in samples to the end of attack stage, relative to the start of the envelope.
   */
  private attackEnd;
  /**
   * The time in samples to the end of hold stage, relative to the start of the envelope.
   */
  private holdEnd;
  /**
   * The time in samples to the end of decay stage, relative to the start of the envelope.
   */
  private decayEnd;
  /**
   * If the volume envelope has ever entered the release phase.
   * @private
   */
  private enteredRelease;
  /**
   * If sustain stage is silent,
   * then we can turn off the voice when it is silent.
   * We can't do that with modulated as it can silence the volume and then raise it again, and the voice must keep playing.
   */
  private canEndOnSilentSustain;
  /**
   * @param sampleRate Hz
   * @param bufferSize samples
   */
  constructor(sampleRate: number, bufferSize: number);
  /**
   * Starts the release phase in the envelope.
   * @param voice the voice this envelope belongs to.
   */
  startRelease(voice: Voice): void;
  /**
   * Initialize the volume envelope
   * @param voice The voice this envelope belongs to
   */
  init(voice: Voice): void;
  /**
   * Calculates the gain value for the last sample in the block and writes it to `outputGain`.
   * Essentially we use approach of 100dB is silence, 0dB is peak.
   * @param sampleCount the amount of samples to write
   * @param gainTarget the gain to apply.
   * @returns if the voice has finished.
   */
  process(sampleCount: number, gainTarget: number): boolean;
  private timecentsToSamples;
}
//#endregion
//#region src/synthesizer/audio_engine/voice/modulation_envelope.d.ts
declare class ModulationEnvelope {
  /**
   * The attack duration, in seconds.
   */
  private attackDuration;
  /**
   * The decay duration, in seconds.
   */
  private decayDuration;
  /**
   * The hold duration, in seconds.
   */
  private holdDuration;
  /**
   * Release duration, in seconds.
   */
  private releaseDuration;
  /**
   * The sustain level 0-1.
   */
  private sustainLevel;
  /**
   * Delay phase end time in seconds, absolute (audio context time).
   */
  private delayEnd;
  /**
   * Attack phase end time in seconds, absolute (audio context time).
   */
  private attackEnd;
  /**
   * Hold phase end time in seconds, absolute (audio context time).
   */
  private holdEnd;
  /**
   * The level of the envelope when the release phase starts.
   */
  private releaseStartLevel;
  /**
   * The current modulation envelope value.
   */
  private currentValue;
  /**
   * If the modulation envelope has ever entered the release phase.
   */
  private enteredRelease;
  /**
   * Decay phase end time in seconds, absolute (audio context time).
   */
  private decayEnd;
  /**
   * Calculates the current modulation envelope value for the given time and voice.
   * @param voice the voice we are working on.
   * @param currentTime in seconds.
   * @returns  mod env value, from 0 to 1.
   */
  process(voice: Voice, currentTime: number): number;
  /**
   * Starts the release phase in the envelope.
   * @param voice the voice this envelope belongs to.
   */
  startRelease(voice: Voice): void;
  /**
   * Initializes the modulation envelope.
   * @param voice the voice this envelope belongs to.
   */
  init(voice: Voice): void;
  private tc2Sec;
}
//#endregion
//#region src/soundbank/basic_soundbank/midi_patch.d.ts
interface MIDIPatch {
  /**
   * The MIDI program number.
   */
  program: number;
  /**
   * The MIDI bank MSB number.
   */
  bankMSB: number;
  /**
   * The MIDI bank LSB number.
   */
  bankLSB: number;
  /**
   * If the preset is marked as GM/GS drum preset. Note that XG drums do not have this flag.
   */
  isGMGSDrum: boolean;
}
interface MIDIPatchFull extends MIDIPatch {
  /**
   * The name of the patch.
   */
  name: string;
  /**
   * Indicates if this patch is a drum patch.
   * This is the recommended way of determining if this is a drum preset.
   * If `isGMGSDrum` is true, then this is a GM/GS drum preset.
   * If `isGMGSDrum` is false, then this is a GM2/XG drum preset.
   */
  isDrum: boolean;
}
declare class MIDIPatchTools {
  /**
   * Converts a given `MIDIPatch` to a string.
   * The format is:
   * - `DRUM:program` for `GMGSDrum` set to `true`.
   * - `bankLSB:bankMSB:program` for `GMGSDrum` set to `false`.
   */
  static toMIDIString(patch: MIDIPatch): string;
  /**
   * Gets `MIDIPatch` from a given string.
   */
  static fromMIDIString(string: string): MIDIPatch;
  /**
   * Converts a given `MIDIPatchFull`to string.
   * The format is:
   * - `<MIDIPatch string> D <name>` for `isDrum` set to `true`.
   * - `<MIDIPatch string> M <name>` for `isDrum` set to `true`.
   */
  static toFullMIDIString(patch: MIDIPatchFull): string;
  /**
   * Gets `MIDIPatchFull` from a given string.
   */
  static fromFullMIDIString(string: string): MIDIPatchFull;
  /**
   * Checks if two MIDI patches represent the same one.
   */
  static matches(patch1: MIDIPatch, patch2: MIDIPatch): boolean;
  /**
   * A comparison function for `.sort()` or `.toSorted()`,
   * ordering the patches in ascending order.
   */
  static compare(a: MIDIPatch, b: MIDIPatch): number;
  /**
   * Checks if the given `MIDIPatchFull` is an XG/GM2 drum patch.
   */
  static isXGDrum(p: MIDIPatchFull): boolean;
  /**
   * A sophisticated patch selection system based on the MIDI Patch system.
   * This is the algorithm that the synthesizer uses for selecting presets.
   * @param patches The `MIDIPatchFull` array to select from.
   * @param patch The `MIDIPatch` to select.
   * @param system The MIDI system to select for.
   * @returns The selected patch.
   */
  static selectPatch<T extends MIDIPatchFull>(patches: T[], patch: MIDIPatch, system: MIDISystem): T;
  private static getAnyDrums;
}
//#endregion
//#region src/soundbank/basic_soundbank/generator.d.ts
declare class Generator {
  /**
   * The generator's SF2 type.
   */
  type: GeneratorType;
  /**
   * The generator's 16-bit value.
   */
  value: number;
  /**
   * Constructs a new generator
   * @param type generator type
   * @param value generator value
   * @param validate if the limits should be validated and clamped.
   */
  constructor(type: GeneratorType, value: number, validate?: boolean);
  write(genData: IndexedByteArray): void;
  toString(): string;
}
//#endregion
//#region src/soundbank/basic_soundbank/basic_zone.d.ts
declare class BasicZone {
  /**
   * The zone's velocity range.
   * min -1 means that it is a default value
   */
  velRange: GenericRange;
  /**
   * The zone's key range.
   * min -1 means that it is a default value.
   */
  keyRange: GenericRange;
  /**
   * The zone's generators.
   */
  generators: Generator[];
  /**
   * The zone's modulators.
   */
  modulators: Modulator[];
  get hasKeyRange(): boolean;
  get hasVelRange(): boolean;
  /**
   * The current tuning in cents, taking in both coarse and fine generators.
   */
  get fineTuning(): number;
  /**
   * The current tuning in cents, taking in both coarse and fine generators.
   */
  set fineTuning(tuningCents: number);
  /**
   * Adds to a given generator, or its default value.
   * @param type the generator type.
   * @param value the value to add.
   * @param validate if the value should be clamped to allowed limits.
   */
  addToGenerator(type: GeneratorType, value: number, validate?: boolean): void;
  /**
   * Sets a generator to a given value if preset, otherwise adds a new one.
   * @param type the generator type.
   * @param value the value to set. Set to null to remove this generator (set as "unset").
   * @param validate if the value should be clamped to allowed limits.
   */
  setGenerator(type: GeneratorType, value: number | null, validate?: boolean): void;
  /**
   * Adds generators to the zone.
   * @param generators the generators to add.
   */
  addGenerators(...generators: Generator[]): void;
  /**
   * Adds modulators to the zone.
   * @param modulators the modulators to add.
   */
  addModulators(...modulators: Modulator[]): void;
  /**
   * Gets a generator value.
   * @param generatorType the generator type.
   * @param notFoundValue if the generator is not found, this value is returned. A default value can be passed here, or null for example,
   * to check if the generator is set.
   */
  getGenerator<K>(generatorType: GeneratorType, notFoundValue: number | K): number | K;
  copyFrom(zone: BasicZone): void;
  /**
   * Filters the generators and prepends the range generators.
   */
  getWriteGenerators(bank: BasicSoundBank): Generator[];
}
//#endregion
//#region src/soundbank/basic_soundbank/basic_instrument_zone.d.ts
declare class BasicInstrumentZone extends BasicZone {
  /**
   * The instrument this zone belongs to.
   */
  readonly parentInstrument: BasicInstrument;
  /**
   * For tracking on the individual zone level, since multiple presets can refer to the same instrument.
   */
  useCount: number;
  /**
   * Creates a new instrument zone.
   * @param instrument The parent instrument.
   * @param sample The sample to use in this zone.
   */
  constructor(instrument: BasicInstrument, sample: BasicSample);
  /**
   * Zone's sample.
   */
  private _sample;
  /**
   * Zone's sample.
   */
  get sample(): BasicSample;
  /**
   * Sets a sample for this zone.
   * @param sample the sample to set.
   */
  set sample(sample: BasicSample);
  getWriteGenerators(bank: BasicSoundBank): Generator[];
}
//#endregion
//#region src/soundbank/basic_soundbank/basic_preset_zone.d.ts
declare class BasicPresetZone extends BasicZone {
  /**
   * The preset this zone belongs to.
   */
  readonly parentPreset: BasicPreset;
  /**
   * Creates a new preset zone.
   * @param preset the preset this zone belongs to.
   * @param instrument the instrument to use in this zone.
   */
  constructor(preset: BasicPreset, instrument: BasicInstrument);
  /**
   * Zone's instrument.
   */
  private _instrument;
  /**
   * Zone's instrument.
   */
  get instrument(): BasicInstrument;
  /**
   * Zone's instrument.
   */
  set instrument(instrument: BasicInstrument);
  getWriteGenerators(bank: BasicSoundBank): Generator[];
}
//#endregion
//#region src/soundbank/basic_soundbank/basic_preset.d.ts
declare class BasicPreset implements MIDIPatchFull {
  /**
   * The parent soundbank instance
   * Currently used for determining default modulators and XG status
   */
  readonly parentSoundBank: BasicSoundBank;
  /**
   * The preset's name
   */
  name: string;
  program: number;
  bankMSB: number;
  bankLSB: number;
  isGMGSDrum: boolean;
  /**
   * The preset's zones
   */
  zones: BasicPresetZone[];
  /**
   * Preset's global zone
   */
  readonly globalZone: BasicZone;
  /**
   * Unused metadata
   */
  library: number;
  /**
   * Unused metadata
   */
  genre: number;
  /**
   * Unused metadata
   */
  morphology: number;
  /**
   * Creates a new preset representation.
   * @param parentSoundBank the sound bank this preset belongs to.
   * @param globalZone optional, a global zone to use.
   */
  constructor(parentSoundBank: BasicSoundBank, globalZone?: BasicZone);
  /**
   * Checks if this preset is a drum preset
   */
  get isDrum(): boolean;
  private static isInRange;
  private static addUniqueModulators;
  private static subtractRanges;
  /**
   * Unlinks everything from this preset.
   */
  delete(): void;
  /**
   * Deletes an instrument zone from this preset.
   * @param index the zone's index to delete.
   */
  deleteZone(index: number): void;
  /**
   * Creates a new preset zone and returns it.
   * @param instrument the instrument to use in the zone.
   */
  createZone(instrument: BasicInstrument): BasicPresetZone;
  /**
   * Preloads (loads and caches synthesis data) for a given key range.
   */
  preload(keyMin: number, keyMax: number): void;
  /**
   * Checks if the bank and program numbers are the same for the given preset as this one.
   * @param preset The preset to check.
   */
  matches(preset: MIDIPatch): boolean;
  /**
   * Returns the voice synthesis data for this preset.
   * @param midiNote the MIDI note number.
   * @param velocity the MIDI velocity.
   * @returns the returned sound data.
   */
  getVoiceParameters(midiNote: number, velocity: number): VoiceParameters[];
  /**
   * BankMSB:bankLSB:program:isGMGSDrum
   */
  toMIDIString(): string;
  toString(): string;
  /**
   * Combines preset into an instrument, flattening the preset zones into instrument zones.
   * This is a really complex function that attempts to work around the DLS limitations of only having the instrument layer.
   * @returns The instrument containing the flattened zones. In theory, it should exactly the same as this preset.
   */
  toFlattenedInstrument(): BasicInstrument;
}
//#endregion
//#region src/soundbank/basic_soundbank/basic_instrument.d.ts
/**
 * Represents a single instrument
 */
declare class BasicInstrument {
  /**
   * The instrument's name
   */
  name: string;
  /**
   * The instrument's zones
   */
  zones: BasicInstrumentZone[];
  /**
   * Instrument's global zone
   */
  readonly globalZone: BasicZone;
  /**
   * Instrument's linked presets (the presets that use it)
   * note that duplicates are allowed since one preset can use the same instrument multiple times.
   */
  readonly linkedTo: BasicPreset[];
  /**
   * How many presets is this instrument used by
   */
  get useCount(): number;
  /**
   * Creates a new instrument zone and returns it.
   * @param sample The sample to use in the zone.
   */
  createZone(sample: BasicSample): BasicInstrumentZone;
  /**
   * Links the instrument ta a given preset
   * @param preset the preset to link to
   */
  linkTo(preset: BasicPreset): void;
  /**
   * Unlinks the instrument from a given preset
   * @param preset the preset to unlink from
   */
  unlinkFrom(preset: BasicPreset): void;
  deleteUnusedZones(): void;
  delete(): void;
  /**
   * Deletes a given instrument zone if it has no uses
   * @param index the index of the zone to delete
   * @param force ignores the use count and deletes forcibly
   * @returns if the zone has been deleted
   */
  deleteZone(index: number, force?: boolean): boolean;
  /**
   * Globalizes the instrument *in-place.*
   * This means trying to move as many generators and modulators
   * to the global zone as possible to reduce clutter and the count of parameters.
   */
  globalize(): void;
}
//#endregion
//#region src/soundbank/basic_soundbank/basic_sample.d.ts
declare class BasicSample {
  /**
   * The sample's name.
   */
  name: string;
  /**
   * Sample rate in Hz.
   */
  sampleRate: number;
  /**
   * Original pitch of the sample as a MIDI note number.
   */
  originalKey: number;
  /**
   * Pitch correction, in cents. Can be negative.
   */
  pitchCorrection: number;
  /**
   * Linked sample, unused if mono.
   */
  linkedSample?: BasicSample;
  /**
   * The type of the sample.
   */
  sampleType: SampleType;
  /**
   * The sample's loop start index, inclusive.
   * In sample data points, relative to the start of the sample.
   *
   * Minimum allowed value is 0.
   */
  loopStart: number;
  /**
   * The sample's loop end index, exclusive.
   * In sample data points, relative to the start of the sample.
   *
   * Maximum allowed value is the sample data length.
   */
  loopEnd: number;
  /**
   * Sample's linked instruments (the instruments that use it)
   * note that duplicates are allowed since one instrument can use the same sample multiple times.
   */
  linkedTo: BasicInstrument[];
  /**
   * Indicates if the data was overridden, so it cannot be copied back unchanged.
   */
  protected dataOverridden: boolean;
  /**
   * The compressed sample data if the sample has been compressed.
   */
  protected compressedData?: Uint8Array;
  /**
   * The sample's audio data.
   */
  protected audioData?: Float32Array;
  /**
   * The basic representation of a sample.
   * @param sampleName The sample's name.
   * @param sampleRate The sample's rate in Hz.
   * @param originalKey The sample's pitch as a MIDI note number.
   * @param pitchCorrection The sample's pitch correction in cents.
   * @param sampleType The sample's type, an enum that can indicate SF3.
   * @param loopStart The sample's loop start relative to the sample start in sample points.
   * @param loopEnd The sample's loop end relative to the sample start in sample points. Inclusive.
   */
  constructor(sampleName: string, sampleRate: number, originalKey: number, pitchCorrection: number, sampleType: SampleType, loopStart: number, loopEnd: number);
  /**
   * Indicates if the sample is compressed using vorbis SF3.
   */
  get isCompressed(): boolean;
  /**
   * If the sample is linked to another sample.
   */
  get isLinked(): boolean;
  /**
   * The sample's use count
   */
  get useCount(): number;
  /**
   * Get raw data for writing the file, either a compressed bit stream or signed 16-bit little endian PCM data.
   * @param allowVorbis if vorbis file data is allowed.
   * @return either s16le or vorbis data.
   */
  getRawData(allowVorbis: boolean): Uint8Array;
  /**
   * Resamples the audio data to a given sample rate.
   */
  resampleData(newSampleRate: number): void;
  /**
   * Compresses the audio data
   * @param encodeVorbis the compression function to use when compressing
   */
  compressSample(encodeVorbis: SampleEncodingFunction): Promise<void>;
  /**
   * Sets the sample type and unlinks if needed.
   * @param type The type to set it to.
   */
  setSampleType(type: SampleType): void;
  /**
   * Unlinks the sample from its stereo link if it has any.
   */
  unlinkSample(): void;
  /**
   * Links a stereo sample.
   * @param sample the sample to link to.
   * @param type either left, right or linked.
   */
  setLinkedSample(sample: BasicSample, type: SampleType): void;
  /**
   * Links the sample to a given instrument
   * @param instrument the instrument to link to
   */
  linkTo(instrument: BasicInstrument): void;
  /**
   * Unlinks the sample from a given instrument
   * @param instrument the instrument to unlink from
   */
  unlinkFrom(instrument: BasicInstrument): void;
  /**
   * Get the float32 audio data.
   * Note that this either decodes the compressed data or passes the ready sampleData.
   * If neither are set then it will throw an error!
   * @returns the audio data
   */
  getAudioData(): Float32Array;
  /**
   * Replaces the audio data *in-place*.
   * @param audioData The new audio data as Float32.
   * @param sampleRate The new sample rate, in Hertz.
   */
  setAudioData(audioData: Float32Array, sampleRate: number): void;
  /**
   * Replaces the audio with a compressed data sample and flags the sample as compressed
   * @param data the new compressed data
   */
  setCompressedData(data: Uint8Array): void;
  /**
   * Encodes s16le sample
   * @return the encoded data
   */
  protected encodeS16LE(): IndexedByteArray;
  /**
   * Decode binary vorbis into a float32 pcm
   */
  protected decodeVorbis(): Float32Array;
}
declare class EmptySample extends BasicSample {
  /**
   * A simplified class for creating samples.
   */
  constructor();
}
//#endregion
//#region src/soundbank/sound_bank_loader.d.ts
declare class SoundBankLoader {
  /**
   * Loads a sound bank from a file buffer.
   * @param buffer The binary file buffer to load.
   * @returns The loaded sound bank, a BasicSoundBank instance.
   */
  static fromArrayBuffer(buffer: ArrayBuffer): BasicSoundBank;
  private static loadDLS;
}
//#endregion
//#region src/synthesizer/audio_engine/voice/voice_modulator.d.ts
declare class VoiceModulator extends Modulator {
  /**
   * Indicates if the given modulator is chorus or reverb effects modulator.
   * This is done to simulate BASSMIDI effects behavior:
   * - defaults to 1000 transform amount rather than 200
   * - values can be changed, but anything above 200 is 1000
   * (except for values above 1000, they are copied directly)
   * - all values below are multiplied by 5 (200 * 5 = 1000)
   * - still can be disabled if the soundfont has its own modulator curve
   * - this fixes the very low amount of reverb by default and doesn't break soundfonts
   */
  readonly isEffectModulator: boolean;
  /**
   * The default resonant modulator does not affect the filter gain.
   * Neither XG nor GS responded to cc #74 in that way.
   */
  readonly isDefaultResonantModulator: boolean;
  /**
   * If this is a modulation wheel modulator (for modulation depth range).
   */
  readonly isModWheelModulator: boolean;
  private constructor();
  static fromData(s1: ModulatorSource, s2: ModulatorSource, destination: GeneratorType, amount: number, transformType: ModulatorTransformType): VoiceModulator;
  static fromModulator(mod: Modulator): VoiceModulator;
}
//#endregion
//#region src/synthesizer/audio_engine/voice/voice_cache.d.ts
/**
 * Represents a cached voice
 */
declare class CachedVoice {
  /**
   * Sample data of this voice.
   */
  readonly sampleData: Float32Array;
  /**
   * The unmodulated (copied to) generators of the voice.
   */
  readonly generators: Int16Array;
  /**
   * The voice's modulators.
   */
  readonly modulators: VoiceModulator[];
  /**
   * Exclusive class number for hi-hats etc.
   */
  readonly exclusiveClass: number;
  /**
   * Target key of the voice (can be overridden by generators)
   */
  readonly targetKey: number;
  /**
   * Target velocity of the voice (can be overridden by generators)
   */
  readonly velocity: number;
  /**
   * MIDI root key of the sample
   */
  readonly rootKey: number;
  /**
   * Start position of the loop
   */
  readonly loopStart: number;
  /**
   * End position of the loop
   */
  readonly loopEnd: number;
  /**
   * Playback step (rate) for sample pitch correction
   */
  readonly playbackStep: number;
  readonly loopingMode: SampleLoopingMode;
  constructor(voiceParams: VoiceParameters, midiNote: number, velocity: number, sampleRate: number);
}
//#endregion
//#region src/synthesizer/audio_engine/effects/types.d.ts
interface EffectProcessor {
  /**
   * 0-127
   * This parameter sets the amount of the effect sent to the effect output.
   */
  level: number;
  /**
   * 0-7
   * A low-pass filter can be applied to the sound coming into the effect to cut the high
   * frequency range. Higher values will cut more of the high frequencies, resulting in a
   * more mellow effect sound.
   */
  preLowpass: number;
}
interface ReverbProcessorSnapshot extends EffectProcessor {
  /**
   * 0-7.
   * If character is not available, it should default to the first one.
   *
   * This parameter selects the type of reverb. 0–5 are reverb effects, and 6 and 7 are delay
   * effects.
   */
  character: number;
  /**
   * 0-127
   * This parameter sets the time over which the reverberation will continue.
   * Higher values result in longer reverberation.
   */
  time: number;
  /**
   * 0-127
   * This parameter is used when the Reverb Character is set to 6 or 7, or the Reverb Type
   * is set to Delay or Panning Delay (Rev Character 6, 7). It sets the way in which delays
   * repeat. Higher values result in more delay repeats.
   */
  delayFeedback: number;
  /**
   * 0 - 127 (ms)
   * This parameter sets the delay time until the reverberant sound is heard.
   * Higher values result in a longer pre-delay time, simulating a larger reverberant space.
   */
  preDelayTime: number;
}
interface ReverbProcessor extends ReverbProcessorSnapshot {
  /**
   * Process the effect and ADDS it to the output.
   * @param input The input buffer to process. It always starts at index 0.
   * @param outputLeft The left output buffer.
   * @param outputRight The right output buffer.
   * @param startIndex The index to start mixing at into the output buffers.
   * @param sampleCount The amount of samples to mix.
   */
  process(input: Float32Array, outputLeft: Float32Array, outputRight: Float32Array, startIndex: number, sampleCount: number): void;
  /**
   * Gets a synthesizer from this effect processor instance.
   */
  getSnapshot(): ReverbProcessorSnapshot;
}
interface ChorusProcessorSnapshot extends EffectProcessor {
  /**
   * 0-127
   * This parameter sets the level at which the chorus sound is re-input (fed back) into the
   * chorus. By using feedback, a denser chorus sound can be created.
   * Higher values result in a greater feedback level.
   */
  feedback: number;
  /**
   * 0-127
   * This parameter sets the delay time of the chorus effect.
   */
  delay: number;
  /**
   * 0-127
   * This parameter sets the speed (frequency) at which the chorus sound is modulated.
   * Higher values result in faster modulation.
   */
  rate: number;
  /**
   * 0-127
   * This parameter sets the depth at which the chorus sound is modulated.
   * Higher values result in deeper modulation.
   */
  depth: number;
  /**
   * 0-127
   * This parameter sets the amount of chorus sound that will be sent to the reverb.
   * Higher values result in more sound being sent.
   */
  sendLevelToReverb: number;
  /**
   * 0-127
   * This parameter sets the amount of chorus sound that will be sent to the delay.
   * Higher values result in more sound being sent.
   */
  sendLevelToDelay: number;
}
interface ChorusProcessor extends ChorusProcessorSnapshot {
  /**
   * Process the effect and ADDS it to the output.
   * @param input The input buffer to process. It always starts at index 0.
   * @param outputLeft The left output buffer.
   * @param outputRight The right output buffer.
   * @param outputReverb The mono input for reverb. It always starts at index 0.
   * @param outputDelay The mono input for delay. It always starts at index 0.
   * @param startIndex The index to start mixing at into the output buffers.
   * @param sampleCount The amount of samples to mix.
   */
  process(input: Float32Array, outputLeft: Float32Array, outputRight: Float32Array, outputReverb: Float32Array, outputDelay: Float32Array, startIndex: number, sampleCount: number): void;
  /**
   * Gets a synthesizer from this effect processor instance.
   */
  getSnapshot(): ChorusProcessorSnapshot;
}
interface DelayProcessorSnapshot extends EffectProcessor {
  /**
   * 0-115
   * 0.1ms-340ms-1000ms
   * The delay effect has three delay times; center, left and
   * right (when listening in stereo). Delay Time Center sets the delay time of the delay
   * located at the center.
   * Refer to SC-8850 Owner's Manual p. 236 for the exact mapping of the values.
   */
  timeCenter: number;
  /**
   * 0-120
   * 4% - 500%
   * This parameter sets the delay time of the delay located at the left as a percentage of
   * the Delay Time Center (up to a max. of 1.0 s).
   * The resolution is 100/24(%).
   */
  timeRatioLeft: number;
  /**
   * 1-120
   * 4%-500%
   * This parameter sets the delay time of the delay located at the right as a percentage of
   * the Delay Time Center (up to a max. of 1.0 s).
   * The resolution is 100/24(%).
   */
  timeRatioRight: number;
  /**
   * 0-127
   * This parameter sets the volume of the central delay. Higher values result in a louder
   * center delay.
   */
  levelCenter: number;
  /**
   * 0-127
   * This parameter sets the volume of the left delay. Higher values result in a louder left
   * delay.
   */
  levelLeft: number;
  /**
   * 0-127
   * This parameter sets the volume of the right delay. Higher values result in a louder
   * right delay.
   */
  levelRight: number;
  /**
   * 0-127
   * (-64)-63
   * This parameter affects the number of times the delay will repeat. With a value of 0,
   * the delay will not repeat. With higher values there will be more repeats.
   * With negative (-) values, the center delay will be fed back with inverted phase.
   * Negative values are effective with short delay times.
   */
  feedback: number;
  /**
   * 0-127
   * This parameter sets the amount of delay sound that is sent to the reverb.
   * Higher values result in more sound being sent.
   */
  sendLevelToReverb: number;
}
interface DelayProcessor extends DelayProcessorSnapshot {
  /**
   * Process the effect and ADDS it to the output.
   * @param input The input buffer to process. It always starts at index 0.
   * @param outputLeft The left output buffer.
   * @param outputRight The right output buffer.
   * @param outputReverb The mono input for reverb. It always starts at index 0.
   * @param startIndex The index to start mixing at into the output buffers.
   * @param sampleCount The amount of samples to mix.
   */
  process(input: Float32Array, outputLeft: Float32Array, outputRight: Float32Array, outputReverb: Float32Array, startIndex: number, sampleCount: number): void;
  /**
   * Gets a synthesizer from this effect processor instance.
   */
  getSnapshot(): DelayProcessorSnapshot;
}
interface InsertionProcessor {
  /**
   * The EFX type of this processor, stored as MSB << | LSB.
   * For example 0x30, 0x10 is 0x3010
   */
  readonly type: number;
  /**
   * 0-1 (floating point)
   * This parameter sets the amount of insertion sound that will be sent to the reverb.
   * Higher values result in more sound being sent.
   */
  sendLevelToReverb: number;
  /**
   * 0-1 (floating point)
   * This parameter sets the amount of insertion sound that will be sent to the chorus.
   * Higher values result in more sound being sent.
   */
  sendLevelToChorus: number;
  /**
   * 0-1 (floating point)
   * This parameter sets the amount of insertion sound that will be sent to the delay.
   * Higher values result in more sound being sent.
   */
  sendLevelToDelay: number;
  /**
   * Resets the params to their default values.
   * This does not need to reset send levels.
   */
  reset(): void;
  /**
   * Sets an EFX parameter.
   * @param parameter The parameter number (0x03-0x16).
   * @param value The new value (0-127).
   */
  setParameter(parameter: number, value: number): void;
  /**
   * Process the effect and ADDS it to the output.
   * @param inputLeft The left input buffer to process. It always starts at index 0.
   * @param inputRight The right input buffer to process. It always starts at index 0.
   * @param outputLeft The left output buffer.
   * @param outputRight The right output buffer.
   * @param outputReverb The mono input for reverb. It always starts at index 0.
   * @param outputChorus The mono input for chorus. It always starts at index 0.
   * @param outputDelay The mono input for delay. It always starts at index 0.
   * @param startIndex The index to start mixing at into the output buffers.
   * @param sampleCount The amount of samples to mix.
   */
  process(inputLeft: Float32Array, inputRight: Float32Array, outputLeft: Float32Array, outputRight: Float32Array, outputReverb: Float32Array, outputChorus: Float32Array, outputDelay: Float32Array, startIndex: number, sampleCount: number): void;
}
interface InsertionProcessorSnapshot {
  type: number;
  /**
   * 20 parameters for the effect, 255 means "no change" + 3 effect sends (index 20, 21, 22)
   */
  params: Uint8Array;
}
type InsertionProcessorConstructor = new (sampleRate: number, maxBufferSize: number) => InsertionProcessor;
//#endregion
//#region src/midi/enums.d.ts
declare const MIDIMessageTypes: {
  readonly noteOff: 128;
  readonly noteOn: 144;
  readonly polyPressure: 160;
  readonly controllerChange: 176;
  readonly programChange: 192;
  readonly channelPressure: 208;
  readonly pitchWheel: 224;
  readonly systemExclusive: 240;
  readonly timecode: 241;
  readonly songPosition: 242;
  readonly songSelect: 243;
  readonly tuneRequest: 246;
  readonly clock: 248;
  readonly start: 250;
  readonly continue: 251;
  readonly stop: 252;
  readonly activeSensing: 254;
  readonly reset: 255;
  readonly sequenceNumber: 0;
  readonly text: 1;
  readonly copyright: 2;
  readonly trackName: 3;
  readonly instrumentName: 4;
  readonly lyric: 5;
  readonly marker: 6;
  readonly cuePoint: 7;
  readonly programName: 8;
  readonly midiChannelPrefix: 32;
  readonly midiPort: 33;
  readonly endOfTrack: 47;
  readonly setTempo: 81;
  readonly smpteOffset: 84;
  readonly timeSignature: 88;
  readonly keySignature: 89;
  readonly sequenceSpecific: 127;
};
type MIDIMessageType = (typeof MIDIMessageTypes)[keyof typeof MIDIMessageTypes];
declare const MIDIControllers: {
  readonly bankSelect: 0;
  readonly modulationWheel: 1;
  readonly breathController: 2;
  readonly undefinedCC3: 3;
  readonly footController: 4;
  readonly portamentoTime: 5;
  readonly dataEntryMSB: 6;
  readonly mainVolume: 7;
  readonly balance: 8;
  readonly undefinedCC9: 9;
  readonly pan: 10;
  readonly expression: 11;
  readonly effectControl1: 12;
  readonly effectControl2: 13;
  readonly undefinedCC14: 14;
  readonly undefinedCC15: 15;
  readonly generalPurposeController1: 16;
  readonly generalPurposeController2: 17;
  readonly generalPurposeController3: 18;
  readonly generalPurposeController4: 19;
  readonly undefinedCC20: 20;
  readonly undefinedCC21: 21;
  readonly undefinedCC22: 22;
  readonly undefinedCC23: 23;
  readonly undefinedCC24: 24;
  readonly undefinedCC25: 25;
  readonly undefinedCC26: 26;
  readonly undefinedCC27: 27;
  readonly undefinedCC28: 28;
  readonly undefinedCC29: 29;
  readonly undefinedCC30: 30;
  readonly undefinedCC31: 31;
  readonly bankSelectLSB: 32;
  readonly modulationWheelLSB: 33;
  readonly breathControllerLSB: 34;
  readonly undefinedCC3LSB: 35;
  readonly footControllerLSB: 36;
  readonly portamentoTimeLSB: 37;
  readonly dataEntryLSB: 38;
  readonly mainVolumeLSB: 39;
  readonly balanceLSB: 40;
  readonly undefinedCC9LSB: 41;
  readonly panLSB: 42;
  readonly expressionLSB: 43;
  readonly effectControl1LSB: 44;
  readonly effectControl2LSB: 45;
  readonly undefinedCC14LSB: 46;
  readonly undefinedCC15LSB: 47;
  readonly undefinedCC16LSB: 48;
  readonly undefinedCC17LSB: 49;
  readonly undefinedCC18LSB: 50;
  readonly undefinedCC19LSB: 51;
  readonly undefinedCC20LSB: 52;
  readonly undefinedCC21LSB: 53;
  readonly undefinedCC22LSB: 54;
  readonly undefinedCC23LSB: 55;
  readonly undefinedCC24LSB: 56;
  readonly undefinedCC25LSB: 57;
  readonly undefinedCC26LSB: 58;
  readonly undefinedCC27LSB: 59;
  readonly undefinedCC28LSB: 60;
  readonly undefinedCC29LSB: 61;
  readonly undefinedCC30LSB: 62;
  readonly undefinedCC31LSB: 63;
  readonly sustainPedal: 64;
  readonly portamentoOnOff: 65;
  readonly sostenutoPedal: 66;
  readonly softPedal: 67;
  readonly legatoFootswitch: 68;
  readonly hold2Pedal: 69;
  readonly soundVariation: 70;
  readonly filterResonance: 71;
  readonly releaseTime: 72;
  readonly attackTime: 73;
  readonly brightness: 74;
  readonly decayTime: 75;
  readonly vibratoRate: 76;
  readonly vibratoDepth: 77;
  readonly vibratoDelay: 78;
  readonly soundController10: 79;
  readonly generalPurposeController5: 80;
  readonly generalPurposeController6: 81;
  readonly generalPurposeController7: 82;
  readonly generalPurposeController8: 83;
  readonly portamentoControl: 84;
  readonly undefinedCC85: 85;
  readonly undefinedCC86: 86;
  readonly undefinedCC87: 87;
  readonly undefinedCC88: 88;
  readonly undefinedCC89: 89;
  readonly undefinedCC90: 90;
  readonly reverbDepth: 91;
  readonly tremoloDepth: 92;
  readonly chorusDepth: 93;
  readonly variationDepth: 94;
  readonly phaserDepth: 95;
  readonly dataIncrement: 96;
  readonly dataDecrement: 97;
  readonly nonRegisteredParameterLSB: 98;
  readonly nonRegisteredParameterMSB: 99;
  readonly registeredParameterLSB: 100;
  readonly registeredParameterMSB: 101;
  readonly undefinedCC102LSB: 102;
  readonly undefinedCC103LSB: 103;
  readonly undefinedCC104LSB: 104;
  readonly undefinedCC105LSB: 105;
  readonly undefinedCC106LSB: 106;
  readonly undefinedCC107LSB: 107;
  readonly undefinedCC108LSB: 108;
  readonly undefinedCC109LSB: 109;
  readonly undefinedCC110LSB: 110;
  readonly undefinedCC111LSB: 111;
  readonly undefinedCC112LSB: 112;
  readonly undefinedCC113LSB: 113;
  readonly undefinedCC114LSB: 114;
  readonly undefinedCC115LSB: 115;
  readonly undefinedCC116LSB: 116;
  readonly undefinedCC117LSB: 117;
  readonly undefinedCC118LSB: 118;
  readonly undefinedCC119LSB: 119;
  readonly allSoundOff: 120;
  readonly resetAllControllers: 121;
  readonly localControlOnOff: 122;
  readonly allNotesOff: 123;
  readonly omniModeOff: 124;
  readonly omniModeOn: 125;
  readonly monoModeOn: 126;
  readonly polyModeOn: 127;
};
type MIDIController = (typeof MIDIControllers)[keyof typeof MIDIControllers];
declare const RegisteredParameterTypes: {
  readonly pitchWheelRange: 0;
  readonly fineTuning: 1;
  readonly coarseTuning: 2;
  readonly modulationDepth: 5;
  readonly resetParameters: 16383;
};
declare const NonRegisteredMSB: {
  readonly partParameter: 1;
  readonly drumPitch: 24;
  readonly drumPitchFine: 25;
  readonly drumLevel: 26;
  readonly drumPan: 28;
  readonly drumReverb: 29;
  readonly drumChorus: 30;
  readonly drumDelay: 31;
  readonly awe32: 127;
  readonly SF2: 120;
};
/**
 * https://cdn.roland.com/assets/media/pdf/SC-8850_OM.pdf
 * http://hummer.stanford.edu/sig/doc/classes/MidiOutput/rpn.html
 * These also seem to match XG
 */
declare const NonRegisteredLSB: {
  readonly vibratoRate: 8;
  readonly vibratoDepth: 9;
  readonly vibratoDelay: 10;
  readonly tvfCutoffFrequency: 32;
  readonly tvfResonance: 33;
  readonly envelopeAttackTime: 99;
  readonly envelopeDecayTime: 100;
  readonly envelopeReleaseTime: 102;
};
//#endregion
//#region src/synthesizer/audio_engine/channel/awe32_nrpn.d.ts
interface ChannelGenerators {
  /**
   * An array of offsets generators for SF2 NRPN support.
   * A value of 0 means no change; -10 means 10 lower, etc.
   */
  offsets: Int16Array;
  /**
   * A small optimization that disables applying offsets until at least one is set.
   */
  offsetsEnabled: boolean;
  /**
   * An array of overrides generators for AWE32 NRPN support.
   * A value of GENERATOR_OVERRIDE_NO_CHANGE_VALUE (-32,767) means no change;
   * other values replace current generators.
   */
  overrides: Int16Array;
  /**
   * A small optimization that disables applying overrides until at least one is set.
   */
  overridesEnabled: boolean;
}
//#endregion
//#region src/synthesizer/enums.d.ts
/**
 * The available interpolation types of the synthesizer.
 */
declare const InterpolationTypes: {
  readonly linear: 0;
  readonly nearestNeighbor: 1;
  readonly hermite: 2;
};
type InterpolationType = (typeof InterpolationTypes)[keyof typeof InterpolationTypes];
//#endregion
//#region src/synthesizer/audio_engine/channel/parameters/system.d.ts
/**
 * The system parameters of the channel.
 * These can only be changed via the API.
 */
interface ChannelSystemParameter {
  /**
   * If the preset is locked, preventing any program changes from being sent.
   */
  presetLock: boolean;
  /**
   * If the channel should not produce any sound
   * and ignore incoming Note On messages.
   */
  isMuted: boolean;
  /**
   * The gain for the channel.
   * From 0 to any number. 1 is 100% volume.
   */
  gain: number;
  /**
   * The panning of the channel.
   * -1 (left) to 1 (right). 0 is center.
   */
  pan: number;
  /**
   * The channel key shift in semitones.
   * Drum channels DO NOT ignore this value.
   */
  keyShift: number;
  /**
   * The channel tuning in cents.
   * Drum channels DO NOT ignore this value.
   */
  fineTune: number;
  /**
   * The interpolation type used for sample playback.
   *
   * Overrides the global parameter if set.
   */
  interpolationType: InterpolationType | null;
  /**
   * If the channel should prevent changing any parameters via NRPN.
   *
   * Overrides the global parameter if set.
   */
  nrpnParamLock: boolean | null;
  /**
   * Indicates whether the channel is in monophonic retrigger mode.
   * This emulates the behavior of Microsoft GS Wavetable Synth,
   * Where a new note will kill the previous one if it is still playing.
   *
   * Overrides the global parameter if set.
   */
  monophonicRetrigger: boolean | null;
}
declare const DEFAULT_CHANNEL_SYSTEM_PARAMETERS: ChannelSystemParameter;
/**
 * Sets a system parameter of the channel
 * @param parameter The type of the system parameter to set.
 * @param value The value to set for the system parameter.
 */
declare function setSystemParameterInternal<P extends keyof ChannelSystemParameter>(this: MIDIChannel, parameter: P, value: ChannelSystemParameter[P]): void;
//#endregion
//#region src/synthesizer/audio_engine/channel/midi_channel.d.ts
/**
 * This class represents a single MIDI Channel within the synthesizer.
 */
declare class MIDIChannel {
  /**
   * The currently selected MIDI patch of the channel.
   * Note that the exact matching preset may not be available, but this represents exactly what MIDI asks for.
   */
  readonly patch: MIDIPatch;
  /**
   * The preset currently assigned to the channel.
   * Note that this may be undefined in some cases.
   */
  preset?: BasicPreset;
  /**
   * The channel's number (0-based index)
   */
  readonly channel: number;
  /**
   * Sets a system parameter of the channel.
   * @param parameter The type of the system parameter to set.
   * @param value The value to set for the system parameter.
   */
  readonly setSystemParameter: typeof setSystemParameterInternal;
  /**
   * Locks or unlocks a given Channel MIDI Parameter.
   * This prevents any changes to it until it's unlocked.
   * @param parameter The Channel MIDI Parameter to lock.
   * @param isLocked If the parameter should be locked.
   */
  readonly lockMIDIParameter: typeof lockMIDIParameterInternal;
  /**
   * An array of MIDI controllers for the channel.
   * This array is used to store the state of various MIDI controllers
   * such as volume, pan, modulation, etc.
   * @remarks
   * A bit of an explanation:
   * The controller table is stored as an int16 array, it stores 14-bit values, allowing for full 14-bit LSB resolution.
   * The only exception from this are the Registered and Non-Registered Parameter Numbers.
   * Data entries do store it!
   */
  protected readonly _midiControllers: Int16Array;
  /**
   * An array of octave tuning values for each note on the channel.
   * Each index corresponds to a note (0 = C, 1 = C#, ..., 11 = B).
   * Note: Repeated every 12 notes.
   */
  protected readonly octaveTuning: Int8Array;
  protected readonly _midiParameters: Readonly<ChannelMIDIParameter>;
  /**
   * Note On message tracking, for grouping voices for specific Note On messages.
   * Used for overlapping Note Ons.
   * MIDI note: current note on ID
   * @protected
   */
  protected readonly noteOnID: number[];
  /**
   * Note Off message tracking, for grouping voices for specific Note On messages.
   * Used for overlapping Note Ons.
   * MIDI note: current note on ID
   * @protected
   */
  protected readonly noteOffID: number[];
  /**
   * If the last Parameter was RPN.
   * If false then the last parameter was NRPN.
   * @protected
   */
  protected lastParameterIsRegistered: boolean;
  /**
   * Per-note pitch wheel mode uses the pitchWheels table as source
   * instead of the regular entry in the midiControllers table.
   */
  protected perNotePitch: boolean;
  /**
   * Current pan in range [-500;500]
   * Updated in `updateInternalParams`.
   * This is used to avoid a big addition for every voice rendering call.
   */
  protected currentPan: number;
  /**
   * Current tuning in cents.
   * Updated in `updateInternalParams`.
   * This is used to avoid a big addition for every voice rendering call.
   */
  protected currentTuning: number;
  /**
   * Current key-shift.
   * Updated in `updateInternalParams`.
   */
  protected currentKeyShift: number;
  /**
   * Current gain.
   * Updated in `updateInternalParams`.
   * This is used to avoid a big multiplication for every voice rendering call.
   */
  protected currentGain: number;
  /**
   * The last pressed note on this channel for portamento tracking.
   * -1 means none.
   * This is not a `ChannelMIDIParameter` and is strictly internal,
   * mostly because we don't want to send events for every note on message.
   * It can be set with Portamento Control CC anyway.
   * @protected
   */
  protected lastPortamentoNote: number;
  /**
   * If the portamento should be executed once regardless of Portamento on/off.
   * Adhering to the MIDI spec, CC#84 ignores on/off.
   * This is also not a `ChannelMIDIParameter` for the same reason as `lastPortamentoNote`
   * @protected
   */
  protected portamentoForce: boolean;
  /**
   * The last pressed note on this channel in mono mode.
   * Used for tracking and releasing this note on a new Note On event.
   * -1 means none.
   * @protected
   */
  protected lastMonoNote: number;
  /**
   * The last pressed note's velocity on this channel in mono mode.
   * @protected
   */
  protected lastMonoVelocity: number;
  /**
   * For Mono Mode restoring notes.
   * playingNotes[midiNote]
   * @protected
   */
  protected readonly playingNotes: boolean[];
  protected readonly generators: ChannelGenerators;
  protected readonly computeModulator: (voice: Voice, pitchWheel: number, modulatorIndex: number) => number;
  protected readonly computeModulators: (voice: Voice, sourceUsesCC?: 0 | 1 | -1 | undefined, sourceIndex?: number | undefined) => void;
  /**
   * Current amount of voices that are playing on this channel.
   */
  protected _voiceCount: number;
  /**
   * Current amount of voices that are playing on this channel.
   */
  get voiceCount(): number;
  /**
   * Indicates whether this channel is a drum channel.
   */
  protected _drumChannel: boolean;
  /**
   * Indicates whether this channel is a drum channel.
   */
  get drumChannel(): boolean;
  /**
   * An array of MIDI controllers for the channel.
   * This array is used to store the state of various MIDI controllers
   * such as volume, pan, modulation, etc.
   * @remarks
   * A bit of an explanation:
   * The controller table is stored as an int16 array, it stores 14-bit values, allowing for full 14-bit LSB resolution.
   * The only exception from this are the Registered and Non-Registered Parameter Numbers.
   * Data entries do store it!
   */
  get midiControllers(): Readonly<Int16Array>;
  /**
   * The channel system parameters of this channel.
   * These are only editable via the API.
   */
  get systemParameters(): Readonly<ChannelSystemParameter>;
  /**
   * The channel MIDI parameters of this channel.
   * These are only editable via MIDI messages.
   */
  get midiParameters(): Readonly<ChannelMIDIParameter>;
  protected get channelSystem(): MIDISystem;
  /**
   * Locks or unlocks a given controller.
   * This prevents any changes to it until it's unlocked.
   * @param controller The MIDI controller number (0-127).
   * @param isLocked If the controller should be locked.
   */
  lockController(this: MIDIChannel, controller: MIDIController, isLocked: boolean): void;
  /**
   * Changes the preset to, or from drums.
   * Note that this executes a program change.
   * @param isDrum If the channel should be a drum preset or not.
   */
  setDrums(isDrum: boolean): void;
  /**
   * Stops all notes on the channel.
   * @param force If true, stops all notes immediately, otherwise applies release time.
   */
  stopAllNotes(force?: boolean): void;
  protected resetGeneratorOverrides(): void;
  protected setGeneratorOverride(gen: GeneratorType, value: number, realtime?: boolean): void;
  protected resetGeneratorOffsets(): void;
  protected setGeneratorOffset(gen: GeneratorType, value: number): void;
  protected resetDrumParams(): void;
  protected computeModulatorsAll(sourceUsesCC: -1 | 0 | 1, sourceIndex: number): void;
  protected setBankMSB(bankMSB: number): void;
  protected setBankLSB(bankLSB: number): void;
  /**
   * Sets drums on channel.
   */
  protected setDrumFlag(isDrum: boolean): void;
}
//#endregion
//#region src/synthesizer/audio_engine/channel/parameters/midi.d.ts
interface ChannelMIDIParameter {
  /**
   * The current pressure (aftertouch) of this channel.
   */
  pressure: number;
  /**
   * The current pitch wheel value (0-16,383) of this channel.
   */
  pitchWheel: number;
  /**
   * The current pitch wheel range, in semitones.
   */
  pitchWheelRange: number;
  /**
   * The modulation depth in cents.
   * This is internally converted to a multiplier by dividing by 50.
   *
   * The MIDI specification assumes the default modulation depth is 50 cents,
   * but it may vary for different sound banks.
   * For example, if a MIDI requests a modulation depth of 100 cents,
   * the multiplier will be 2,
   * which, for a preset with a depth of 50,
   * will create a total modulation depth of 100 cents.
   */
  modulationDepth: number;
  /**
   * The channel's receiving number (0-based index).
   * This allows triggering multiple parts (channels) with a single note message.
   * @remarks
   * Only used when customChannelNumbers is enabled.
   */
  rxChannel: number;
  /**
   * If the channel is in the poly mode.
   * - `true` - POLY ON - regular playback.
   * - `false` - MONO ON - one note per channel,
   * highest still pressed note is restored after releasing the currently playing one.
   */
  polyMode: boolean;
  /**
   * The key shift of the channel (in semitones).
   * Drum channels ignore this value.
   */
  keyShift: number;
  /**
   * Cents, RPN/SysEx for fine-tuning.
   * Drum channels ignore this value.
   */
  fineTune: number;
  /**
   * Enables random panning for every note played on this channel.
   */
  randomPan: boolean;
  /**
   * Assign mode for the channel:
   * - `0` - A new note will kill the previous one if it is still playing.
   * - Any other value - A new note will not kill the previous notes (default).
   *
   * While GS and XG differentiate 1 (Limited Multi for GS/Multi for XG) and 2 (Full Multi for GS/Inst (for Drum)),
   * SpessaSynth treats them both as full Multi. (no note killing is performed)
   *
   * This may be useful for emulating SC-55 hi-hat cutoff or MSGS note cutoff.
   *
   * Refer to [SC-8850 Owner's Manual](https://cdn.roland.com/assets/media/pdf/SC-8850_OM.pdf), page 238 for more description.
   * Note that `SAME NOTE NUMBER KEY ON ASSIGN` in XG is also recognized as assign mode.
   */
  assignMode: number;
  /**
   * Indicates whether this channel uses the insertion EFX processor.
   */
  efxAssign: boolean;
  /**
   * CC1 for GS controller matrix.
   * An arbitrary MIDI controller, which can be bound to any synthesis parameter.
   * Default is 16.
   */
  cc1: MIDIController;
  /**
   * CC2 for GS controller matrix.
   * An arbitrary MIDI controller, which can be bound to any synthesis parameter.
   * Default is 17.
   */
  cc2: MIDIController;
  /**
   * Drum map for GS system exclusive tracking.
   * Only used for selecting the correct channel when setting drum parameters through sysEx,
   * as those don't specify the channel, but the drum number.
   *
   * The only values that are allowed are 0 (melodic) 1 or 2.
   */
  drumMap: number;
  /**
   * The relation between the input and the actual velocity.
   *
   * If Velo Depth is increased, small differences in your playing dynamics will make a large difference in the loudness of the sound.
   * If Velo Depth is decreased, even large differences in your playing dynamics will make only a small difference in the loudness of the sound.
   *
   * Examples (with offset being set to normal):
   *
   * - 64 is normal.
   * - 32 is half velocity at max volume.
   * - 127 is max velocity at half volume.
   *
   * Refer to [SC-8850 Owner's Manual](https://cdn.roland.com/assets/media/pdf/SC-8850_OM.pdf), page 56.
   */
  velocitySenseDepth: number;
  /**
   * The offset to add to the input velocity.
   *
   * If Velo Offset is set higher than 64, even softly played notes (i.e., notes with a low velocity)
   * will be sounded loudly. If Velo Offset is set lower than 64,
   * even strongly played notes (i.e., notes with a high velocity) will be sounded softly.
   *
   * Examples (with depth set to normal):
   *
   * - 64 is normal.
   * - 32 is silent until half velocity, max velocity is half volume.
   * - 96 starts at half volume and reaches max volume at half velocity.
   * - 127 always forces velocity to max.
   *
   * Refer to [SC-8850 Owner's Manual](https://cdn.roland.com/assets/media/pdf/SC-8850_OM.pdf), page 56.
   */
  velocitySenseOffset: number;
}
declare const DEFAULT_CHANNEL_MIDI_PARAMETERS: ChannelMIDIParameter;
/**
 * Locks or unlocks a given Channel MIDI Parameter.
 * This prevents any changes to it until it's unlocked.
 * @param parameter The Channel MIDI Parameter to lock.
 * @param isLocked If the parameter should be locked.
 */
declare function lockMIDIParameterInternal<P extends keyof ChannelMIDIParameter>(this: MIDIChannel, parameter: P, isLocked: boolean): void;
//#endregion
//#region src/synthesizer/audio_engine/channel/types.d.ts
interface NoteOnCallback {
  /** The MIDI note number. */
  midiNote: number;
  /** The MIDI channel number. */
  channel: number;
  /** The velocity of the note. */
  velocity: number;
}
interface NoteOffCallback {
  /** The MIDI note number. */
  midiNote: number;
  /** The MIDI channel number. */
  channel: number;
}
interface ProgramChangeCallback extends MIDIPatchFull {
  /** The MIDI channel number. */
  channel: number;
}
interface ControllerChangeCallback {
  /** The MIDI channel number. */
  channel: number;
  /** The controller number. */
  controller: MIDIController;
  /** The value of the controller. */
  value: number;
}
interface PolyPressureCallback {
  /** The MIDI channel number. */
  channel: number;
  /** The MIDI note number. */
  midiNote: number;
  /** The pressure value. */
  pressure: number;
}
interface StopAllCallback {
  /**
   * The MIDI channel number.
   */
  channel: number;
  /**
   * If the channel was force stopped. (no release time)
   */
  force: boolean;
}
type ChannelMIDIParameterChange = { [P in keyof ChannelMIDIParameter]: {
  /**
   * The channel that was affected.
   */
  channel: number;
  /**
   * The parameter that was changed.
   */
  parameter: P;
  /**
   * The new value of this parameter.
   */
  value: ChannelMIDIParameter[P];
} }[keyof ChannelMIDIParameter];
//#endregion
//#region src/synthesizer/audio_engine/sound_bank_manager.d.ts
declare class SoundBankManager {
  /**
   * All the sound banks, ordered from the most important to the least.
   */
  soundBankList: SoundBankManagerListEntry[];
  private readonly presetListChangeCallback;
  private selectablePresetList;
  /**
   * @param presetListChangeCallback Supplied by the parent synthesizer class,
   * this is called whenever the preset list changes.
   */
  constructor(presetListChangeCallback: () => unknown);
  private _presetList;
  /**
   * The list of all presets in the sound bank stack.
   */
  get presetList(): MIDIPatchFull[];
  /**
   * The current sound bank priority order.
   * @returns The IDs of the sound banks in the current order.
   */
  get priorityOrder(): string[];
  /**
   * The current sound bank priority order.
   * @param newList The new order of sound bank IDs.
   */
  set priorityOrder(newList: string[]);
  /**
   * Deletes a given sound bank by its ID.
   * @param id the ID of the sound bank to delete.
   */
  deleteSoundBank(id: string): void;
  /**
   * Adds a new sound bank with a given ID, or replaces an existing one.
   * @param font the sound bank to add.
   * @param id the ID of the sound bank.
   * @param bankOffset the bank offset of the sound bank.
   */
  addSoundBank(font: BasicSoundBank, id: string, bankOffset?: number): void;
  destroy(): void;
  private generatePresetList;
}
//#endregion
//#region src/synthesizer/audio_engine/key_modifier_manager.d.ts
declare class KeyModifier {
  /**
   * The new override velocity. -1 means unchanged.
   */
  velocity: number;
  /**
   * The MIDI patch this key uses. -1 on any property means unchanged.
   */
  patch: MIDIPatch;
  /**
   * Linear gain override for the voice.
   */
  gain: number;
}
declare class KeyModifierManager {
  /**
   * The velocity override mappings for MIDI keys
   * stored as [channelNumber][midiNote].
   */
  private keyMappings;
  /**
   * Add a mapping for a MIDI key to a KeyModifier.
   * @param channel The MIDI channel number.
   * @param midiNote The MIDI note number (0-127).
   * @param mapping The KeyModifier to apply for this key.
   */
  addMapping(channel: number, midiNote: number, mapping: KeyModifier): void;
  /**
   * Delete a mapping for a MIDI key.
   * @param channel The MIDI channel number.
   * @param midiNote The MIDI note number (0-127).
   */
  deleteMapping(channel: number, midiNote: number): void;
  /**
   * Clear all key mappings.
   */
  clearMappings(): void;
  /**
   * Sets the key mappings to a new array.
   * @param mappings A 2D array where the first dimension is the channel number and the second dimension is the MIDI note number.
   */
  setMappings(mappings: (KeyModifier | undefined)[][]): void;
  /**
   * Returns the current key mappings.
   */
  getMappings(): (KeyModifier | undefined)[][];
  /**
   * Gets the velocity override for a MIDI key.
   * @param channel The MIDI channel number.
   * @param midiNote The MIDI note number (0-127).
   * @returns The velocity override, or -1 if no override is set.
   */
  getVelocity(channel: number, midiNote: number): number;
  /**
   * Gets the gain override for a MIDI key.
   * @param channel The MIDI channel number.
   * @param midiNote The MIDI note number (0-127).
   * @returns The gain override, or 1 if no override is set.
   */
  getGain(channel: number, midiNote: number): number;
  /**
   * Checks if a MIDI key has an override for the patch.
   * @param channel The MIDI channel number.
   * @param midiNote The MIDI note number (0-127).
   * @returns True if the key has an override patch, false otherwise.
   */
  hasOverridePatch(channel: number, midiNote: number): boolean;
  /**
   * Gets the patch override for a MIDI key.
   * @param channel The MIDI channel number.
   * @param midiNote The MIDI note number (0-127).
   * @returns An object containing the bank and program numbers.
   * @throws Error if no modifier is set for the key.
   */
  getPatch(channel: number, midiNote: number): MIDIPatch;
}
//#endregion
//#region src/synthesizer/audio_engine/channel/channel_snapshot.d.ts
interface DrumParameterSnapshot {
  pitch: number;
  gain: number;
  exclusiveClass: number;
  pan: number;
  reverbGain: number;
  chorusGain: number;
  delayGain: number;
  rxNoteOn: boolean;
  rxNoteOff: boolean;
}
interface ChannelSnapshot {
  patch?: MIDIPatchFull;
  lockedSystem: MIDISystem;
  midiControllers: Int16Array;
  lockedControllers: boolean[];
  pitchWheels: Int16Array;
  generators: ChannelGenerators;
  midiParameters: ChannelMIDIParameter;
  lockedMIDIParameters: Record<keyof ChannelMIDIParameter, boolean>;
  systemParameters: ChannelSystemParameter;
  octaveTuning: Int8Array;
  perNotePitch: boolean;
  drumParams: DrumParameterSnapshot[];
  drumChannel: boolean;
  channel: number;
}
//#endregion
//#region src/synthesizer/audio_engine/parameters/system.d.ts
/**
 * The global parameters of the synthesizer.
 * These can only be changed via the API.
 */
interface GlobalSystemParameter {
  /**
   * If the synthesizer processes the audio effects.
   */
  effectsEnabled: boolean;
  /**
   * If the event system is enabled.
   */
  eventsEnabled: boolean;
  /**
   * The maximum number of voices that can be played at once.
   *
   * Increasing this value causes memory allocation for more voices.
   * It is recommended to set it at the beginning, before rendering audio to avoid GC.
   * Decreasing it does not cause memory usage change, so it's fine to use.
   */
  voiceCap: number;
  /**
   * Enabling this parameter will cause a new voice allocation when the voice cap is hit, rather than stealing existing voices.
   *
   * This is not recommended in real-time environments.
   */
  autoAllocateVoices: boolean;
  /**
   * The reverb effect gain.
   * From 0 to any number. 1 is 100% reverb.
   */
  reverbGain: number;
  /**
   * If the synthesizer should prevent editing of the reverb parameters.
   * This effect is modified using MIDI system exclusive messages, so
   * the recommended use case would be setting
   * the reverb parameters then locking it to prevent changes by MIDI files.
   */
  reverbLock: boolean;
  /**
   * The chorus effect gain.
   * From 0 to any number. 1 is 100% chorus.
   */
  chorusGain: number;
  /**
   * If the synthesizer should prevent editing of the chorus parameters.
   * This effect is modified using MIDI system exclusive messages, so
   * the recommended use case would be setting
   * the chorus parameters then locking it to prevent changes by MIDI files.
   */
  chorusLock: boolean;
  /**
   * The delay effect gain.
   * From 0 to any number. 1 is 100% delay.
   */
  delayGain: number;
  /**
   * If the synthesizer should prevent editing of the delay parameters.
   * This effect is modified using MIDI system exclusive messages, so
   * the recommended use case would be setting
   * the delay parameters then locking it to prevent changes by MIDI files.
   */
  delayLock: boolean;
  /**
   * If the synthesizer should prevent changing the insertion effect type and parameters.
   * This effect is modified using MIDI system exclusive messages, so
   * the recommended use case would be setting
   * the insertion effect type and parameters then locking it to prevent changes by MIDI files.
   *
   * To lock the channel insertion assign, lock the `efxAssign` parameter instead.
   */
  insertionEffectLock: boolean;
  /**
   * If the synthesizer should prevent editing of the drum parameters.
   * These params are modified using MIDI system exclusive messages or NRPN, so
   * the recommended use case would be setting
   * the drum parameters then locking it to prevent changes by MIDI files.
   */
  drumLock: boolean;
  /**
   * Forces note killing instead of releasing. Improves performance in black MIDIs.
   */
  blackMIDIMode: boolean;
  /**
   * Synthesizer's device ID for system exclusive messages. Set to -1 to accept all.
   */
  deviceID: number;
  /**
   * The master gain.
   * From 0 to any number. 1 is 100% volume.
   */
  gain: number;
  /**
   * The master pan.
   * From -1 (left) to 1 (right). 0 is center.
   *
   * This uses the cosine panning law, so the perceived loudness remains constant as the pan changes.
   */
  pan: number;
  /**
   * The global key shift in semitones.
   * Drum channels ignore this value.
   */
  keyShift: number;
  /**
   * The global tuning in cents.
   * Drum channels ignore this value.
   */
  fineTune: number;
  /**
   * The interpolation type used for sample playback.
   */
  interpolationType: InterpolationType;
  /**
   * If the synthesizer should prevent changing any parameters via NRPN.
   */
  nrpnParamLock: boolean;
  /**
   * Indicates whether the synthesizer is in monophonic retrigger mode.
   * This emulates the behavior of Microsoft GS Wavetable Synth,
   * Where a new note will kill the previous one if it is still playing.
   */
  monophonicRetrigger: boolean;
}
declare const DEFAULT_GLOBAL_SYSTEM_PARAMETERS: GlobalSystemParameter;
//#endregion
//#region src/synthesizer/audio_engine/synthesizer_snapshot.d.ts
interface SynthesizerSnapshot {
  midiChannels: ChannelSnapshot[];
  /**
   * Key modifiers.
   */
  keyMappings: (KeyModifier | undefined)[][];
  midiParameters: GlobalMIDIParameter;
  lockedMIDIParameters: Record<keyof GlobalMIDIParameter, boolean>;
  systemParameters: GlobalSystemParameter;
  reverbProcessor: ReverbProcessorSnapshot;
  chorusProcessor: ChorusProcessorSnapshot;
  delayProcessor: DelayProcessorSnapshot;
  insertionProcessor: InsertionProcessorSnapshot;
}
//#endregion
//#region src/midi/types.d.ts
/**
 * RMIDInfoData type represents metadata for an RMIDI file.
 */
interface RMIDInfoData {
  /**
   * The name of the song.
   */
  name: string;
  /**
   * The engineer who worked on the sound bank file.
   */
  engineer: string;
  /**
   * The artist of the MIDI file.
   */
  artist: string;
  /**
   * The album of the song.
   */
  album: string;
  /**
   * The genre of the song.
   */
  genre: string;
  /**
   * The image for the file (album cover).
   */
  picture: ArrayBuffer;
  /**
   * The comment of the file.
   */
  comment: string;
  /**
   * The creation date of the file.
   */
  creationDate: Date;
  /**
   * The copyright of the file.
   */
  copyright: string;
  /**
   * The encoding of the RMIDI info.
   */
  infoEncoding: string;
  /**
   * The encoding of the MIDI file's text messages.
   */
  midiEncoding: string;
  /**
   * The software used to write the file.
   */
  software: string;
  /**
   * The subject of the file.
   */
  subject: string;
}
interface TempoChange {
  /**
   * MIDI ticks of the change, absolute value from the start of the MIDI file.
   */
  ticks: number;
  /**
   * New tempo in BPM.
   */
  tempo: number;
}
type MIDILoopType = "soft" | "hard";
interface MIDILoop {
  /**
   * Start of the loop, in MIDI ticks.
   */
  start: number;
  /**
   * End of the loop, in MIDI ticks.
   */
  end: number;
  /**
   * The type of the loop detected:
   * - Soft - the playback will immediately jump to the loop start pointer without any further processing.
   * - Hard - the playback will quickly process all messages from
   * the start of the file to ensure that synthesizer is in the correct state.
   * This is the default behavior.
   *
   * Soft loop types are enabled for Touhou and GameMaker loop points.
   */
  type: MIDILoopType;
}
type MIDIFormat = 0 | 1 | 2;
interface NoteTime {
  /**
   * The MIDI key number.
   */
  midiNote: number;
  /**
   * Start of the note, in seconds.
   */
  start: number;
  /**
   * Length of the note, in seconds.
   */
  length: number;
  /**
   * The MIDI velocity of the note.
   */
  velocity: number;
}
interface RMIDIWriteOptions {
  /**
   * The bank offset for RMIDI.
   */
  bankOffset: number;
  /**
   * The metadata of the file. Optional.
   */
  metadata: Partial<Omit<RMIDInfoData, "infoEncoding">>;
  /**
   * If the MIDI file should internally be corrected to work with the set bank offset.
   */
  correctBankOffset: boolean;
  /**
   * The optional sound bank instance used to correct bank offset.
   */
  soundBank?: BasicSoundBank;
}
type RMIDInfoFourCC = "INAM" | "IPRD" | "IALB" | "IART" | "IGNR" | "IPIC" | "ICOP" | "ICRD" | "ICRT" | "ICMT" | "IENG" | "ISFT" | "ISBJ" | "IENC" | "MENC" | "DBNK";
interface TimelineEvent {
  /**
   * The track number of this event.
   */
  tr: number;
  /**
   * The index of this event within the track.
   */
  ev: number;
}
type SysExAcceptedArray = number[] | Uint8Array | Int8Array | Uint8ClampedArray;
//#endregion
//#region src/midi/midi_message.d.ts
declare class MIDIMessage {
  /**
   * Absolute number of MIDI ticks from the start of the track.
   */
  ticks: number;
  /**
   * The MIDI message status byte. Note that for meta events, it is the second byte. (not 0xFF).
   */
  statusByte: MIDIMessageType;
  /**
   * Message's binary data.
   */
  data: Uint8Array<ArrayBuffer>;
  /**
   * Creates a new MIDI message.
   * @param ticks time of this message in absolute MIDI ticks.
   * @param byte the message status byte.
   * @param data the message's binary data.
   */
  constructor(ticks: number, byte: MIDIMessageType, data: Uint8Array<ArrayBuffer>);
  /**
   * Returns a new MIDI Pitch Wheel message.
   * @param ticks time of this message in absolute MIDI ticks.
   * @param channel the channel number of this message.
   * @param value the new value, between 0 and 16383, where 8192 is the center (no pitch change).
   */
  static pitchWheel(ticks: number, channel: number, value: number): MIDIMessage;
  /**
   * Returns a new MIDI Channel Pressure message.
   * @param ticks time of this message in absolute MIDI ticks.
   * @param channel the channel number of this message.
   * @param value the new value, between 0 and 127.
   */
  static channelPressure(ticks: number, channel: number, value: number): MIDIMessage;
  /**
   * Returns a new MIDI Program Change message.
   * @param ticks time of this message in absolute MIDI ticks.
   * @param channel the channel number of this message.
   * @param program the new MIDI program number, between 0 and 127.
   */
  static programChange(ticks: number, channel: number, program: number): MIDIMessage;
  /**
   * Returns a new MIDI Controller Change message.
   * @param ticks time of this message in absolute MIDI ticks.
   * @param channel the channel number of this message.
   * @param controller the MIDI controller.
   * @param value the new value.
   */
  static controllerChange(ticks: number, channel: number, controller: MIDIController, value: number): MIDIMessage;
  /**
   * Returns a new MIDI System Exclusive message.
   * @param ticks time of this message in absolute MIDI ticks.
   * @param data the data of the system exclusive message,
   * excluding the starting 0xF0 byte.
   */
  static systemExclusive(ticks: number, data: number[]): MIDIMessage;
  /**
   * Returns a new MIDI Registered Parameter message. Sends both data MSB and LSB.
   * @param ticks time of this message in absolute MIDI ticks.
   * @param channel the channel number of this message.
   * @param parameter the 14-bit MIDI registered parameter number.
   * @param value the 14-bit new value.
   */
  static registeredParameter(ticks: number, channel: number, parameter: number, value: number): MIDIMessage[];
}
//#endregion
//#region src/synthesizer/processor.d.ts
/**
 * Processor.ts
 * purpose: the core synthesis engine
 */
declare class SpessaSynthProcessor {
  /**
   * Controls if the processor is fully initialized.
   */
  readonly processorInitialized: Promise<void>;
  /**
   * Sample rate in Hertz.
   */
  readonly sampleRate: number;
  /**
   * Calls when an event occurs.
   * @param event The event that occurred.
   */
  onEventCall?: (event: SynthProcessorEvent) => unknown;
  /**
   * Renders float32 audio data to stereo outputs; buffer size must be equal or smaller than `maxBufferSize`.
   * All float arrays must have the same length.
   * @param left the left output channel.
   * @param right the right output channel.
   * @param startIndex start offset of the passed arrays, rendering starts at this index, defaults to 0.
   * @param sampleCount the length of the rendered buffer, defaults to float32array length - startOffset.
   */
  readonly process: (left: Float32Array, right: Float32Array, startIndex?: number, sampleCount?: number) => void;
  /**
   * Renders float32 audio data to stereo outputs; buffer size must be equal or smaller than `maxBufferSize`.
   * All float arrays must have the same length.
   * @param outputs any number stereo pairs (L, R) to render channels separately into.
   * @param effectsLeft the left stereo effect output buffer.
   * @param effectsRight the left stereo effect output buffer.
   * @param startIndex start offset of the passed arrays, rendering starts at this index, defaults to 0.
   * @param sampleCount the length of the rendered buffer, defaults to float32array length - startOffset.
   */
  readonly processSplit: (outputs: Float32Array[][], effectsLeft: Float32Array, effectsRight: Float32Array, startIndex?: number, sampleCount?: number) => void;
  /**
   * Executes a system exclusive message for the synthesizer.
   * @param syx The system exclusive message as an array of bytes.
   * @param channelOffset The channel offset to apply (default is 0).
   */
  readonly systemExclusive: (syx: SysExAcceptedArray, channelOffset?: number) => void;
  /**
   * Executes a MIDI controller change message on the specified channel.
   * @param channel The MIDI channel to change the controller on.
   * @param controller The MIDI controller number (0-127).
   * @param value The value of the controller (0-127).
   */
  readonly controllerChange: (channel: number, controller: MIDIController, value: number) => void;
  /**
   * Executes a MIDI Note On message on the specified channel.
   * Starts playing a note.
   * @param channel The MIDI channel to send the note on.
   * @param midiNote The MIDI note number to play.
   * @param velocity The velocity of the note, from 0 to 127.
   * @remarks
   * If the velocity is 0, it will be treated as a Note Off message.
   */
  readonly noteOn: (channel: number, midiNote: number, velocity: number) => void;
  /**
   * Executes a MIDI Note Off message on the specified channel.
   * Stops playing a note.
   * @param channel The MIDI channel to send the note off.
   * @param midiNote The MIDI note number to stop playing.
   */
  readonly noteOff: (channel: number, midiNote: number) => void;
  /**
   * Executes a MIDI Poly Pressure (Aftertouch) message on the specified channel.
   * This differs from the Channel Pressure in that it's per-note and not for the whole channel.
   * @param channel The MIDI channel to send the poly pressure on.
   * @param midiNote The MIDI note number to apply the pressure to.
   * @param pressure The pressure value, from 0 to 127.
   */
  readonly polyPressure: (channel: number, midiNote: number, pressure: number) => void;
  /**
   * Executes a MIDI Channel Pressure (Aftertouch) message on the specified channel.
   * @param channel The MIDI channel to send the channel pressure on.
   * @param pressure The pressure value, from 0 to 127.
   */
  readonly channelPressure: (channel: number, pressure: number) => void;
  /**
   * Executes a MIDI Pitch Wheel message on the specified channel.
   * @param channel The MIDI channel to send the pitch wheel on.
   * @param pitch The new pitch value: 0-16383
   * @param midiNote The MIDI note number (optional), pass -1 for the regular pitch wheel.
   */
  readonly pitchWheel: (channel: number, pitch: number, midiNote?: number) => void;
  /**
   * Executes a MIDI Program Change message on the specified channel.
   * @param channel The MIDI channel to send the program change on.
   * @param programNumber The program number to change to, from 0 to 127.
   */
  readonly programChange: (channel: number, programNumber: number) => void;
  /**
   * Processes a raw MIDI message and allows scheduling it at a specific time.
   * @param message The MIDI message to process.
   * @param channelOffset The channel offset for the message. It will be added to message's channel number if applicable.
   * @param options Additional options for scheduling the message.
   */
  readonly processMessage: (message: SysExAcceptedArray | MIDIMessage, channelOffset?: number, options?: SynthMethodOptions) => void;
  /**
   * Processes multiple MIDI messages and allows scheduling them at a specific time.
   * @param message The MIDI messages to process.
   * @param channelOffset The channel offset for the messages. It will be added to messages' channel number if applicable.
   * @param options Additional options for scheduling the message.
   */
  readonly processMessages: (message: (SysExAcceptedArray | MIDIMessage)[], channelOffset?: number, options?: SynthMethodOptions) => void;
  /**
   * Core synthesis engine.
   */
  private readonly synthCore;
  /**
   * For applying the snapshot after an override sound bank too.
   */
  private savedSnapshot?;
  /**
   * Creates a new synthesizer engine.
   * @param sampleRate sample rate, in Hertz.
   * @param opts the processor's options.
   */
  constructor(sampleRate: number, opts?: Partial<SynthProcessorOptions>);
  /**
   * All MIDI channels of the synthesizer.
   * @readonly
   */
  get midiChannels(): readonly MIDIChannel[];
  /**
   * The global MIDI parameters of the synthesizer.
   * These are only editable via MIDI messages.
   */
  get midiParameters(): Readonly<GlobalMIDIParameter>;
  /**
   * The global system parameters of the synthesizer.
   * These are only editable via the API.
   */
  get systemParameters(): Readonly<GlobalSystemParameter>;
  /**
   * Current total amount of voices that are currently playing.
   */
  get voiceCount(): number;
  /**
   * The current time of the synthesizer, in seconds. You probably should not modify this directly.
   */
  get currentTime(): number;
  /**
   * Synthesizer's reverb processor.
   */
  get reverbProcessor(): ReverbProcessor;
  /**
   * Synthesizer's chorus processor.
   */
  get chorusProcessor(): ChorusProcessor;
  /**
   * Synthesizer's delay processor.
   */
  get delayProcessor(): DelayProcessor;
  /**
   * The sound bank manager, which manages all sound banks and presets.
   */
  get soundBankManager(): SoundBankManager;
  /**
   * Handles the custom key overrides: velocity and preset
   */
  get keyModifierManager(): KeyModifierManager;
  /**
   * A handler for missing presets during program change. By default, it warns to console.
   * @param patch The MIDI patch that was requested.
   * @param system The MIDI System for the request.
   * @returns If a BasicPreset instance is returned, it will be used by the channel.
   */
  onMissingPreset: (patch: MIDIPatch, system: MIDISystem) => BasicPreset | undefined;
  /**
   * Locks or unlocks a given Global MIDI Parameter.
   * This prevents any changes to it until it's unlocked.
   * @param parameter The Global MIDI Parameter to lock.
   * @param isLocked If the parameter should be locked.
   */
  lockMIDIParameter<P extends keyof GlobalMIDIParameter>(parameter: P, isLocked: boolean): void;
  /**
   * Sets a system parameter of the synthesizer.
   * @param parameter The type of the system parameter to set.
   * @param value The value to set for the system parameter.
   */
  setSystemParameter<P extends keyof GlobalSystemParameter>(parameter: P, value: GlobalSystemParameter[P]): void;
  /**
   * Executes a full synthesizer reset.
   * This will reset all controllers to their default values,
   * except for the locked controllers.
   */
  reset(): void;
  /**
   * Applies the snapshot to this `SpessaSynthProcessor` instance.
   * @param snapshot The snapshot to apply.
   */
  applySnapshot(snapshot: SynthesizerSnapshot): void;
  /**
   * Gets a synthesizer snapshot from this processor instance.
   */
  getSnapshot(): SynthesizerSnapshot;
  /**
   * Creates a new MIDI channel and adds it to the synthesizer.
   */
  createMIDIChannel(): void;
  /**
   * Stops all notes on all channels.
   * @param force If true, all notes are stopped immediately, otherwise they are stopped gracefully.
   */
  stopAllChannels(force?: boolean): void;
  /**
   *  Destroy the synthesizer processor, clearing all channels and voices.
   *  This is irreversible, so use with caution.
   */
  destroySynthProcessor(): void;
  /**
   * Clears the synthesizer's voice cache.
   */
  clearCache(): void;
  /**
   * Calls synth event
   * @param eventName the event name
   * @param eventData the event data
   */
  private callEvent;
  private missingPreset;
}
//#endregion
//#region src/synthesizer/audio_engine/synth_constants.d.ts
/**
 * Synthesizer's default voice cap.
 */
declare const VOICE_CAP = 350;
/**
 * Default MIDI drum channel.
 */
declare const DEFAULT_PERCUSSION = 9;
/**
 * Default bank select and SysEx mode.
 */
declare const DEFAULT_SYNTH_MODE: MIDISystem;
/**
 * This panning factor ensures that spessasynth doesn't stay too loud.
 * You can set te `gain` system parameter to an inverse of it to negate the effect.
 */
declare const SPESSASYNTH_GAIN_FACTOR = 0.6;
/**
 * The default buffer size for the synthesizer.
 */
declare const SPESSA_BUFSIZE = 128;
/**
 * The amount of MIDI controllers (127)
 */
declare const CONTROLLER_TABLE_SIZE = 128;
//#endregion
//#region src/synthesizer/audio_engine/channel/reset.d.ts
/**
 * An array with the default MIDI controller values.
 * Note that these are 14-bit, requiring a 7-bit shift to the right for 7-bit values!
 */
declare const DEFAULT_MIDI_CONTROLLERS: Readonly<Int16Array>;
declare const DEFAULT_DRUM_REVERB: Int8Array<ArrayBuffer>;
//#endregion
//#region src/synthesizer/audio_engine/parameters/midi.d.ts
interface GlobalMIDIParameter {
  /**
   * The currently enabled MIDI system used by the synthesizer
   * for bank selects and system exclusives.
   * (GM, GM2, GS, XG)
   */
  system: MIDISystem;
  /**
   * The global key shift in semitones.
   * Drum channels ignore this value.
   */
  keyShift: number;
  /**
   * The global tuning in cents.
   * Drum channels ignore this value.
   */
  fineTune: number;
  /**
   * The master volume.
   * From 0 (silent) to 1 (full volume).
   *
   * This differs from the `gain` system parameter in that it is squared internally.
   */
  volume: number;
  /**
   * The master pan.
   * From -1 (left) to 1 (right). 0 is center.
   *
   * This uses the cosine panning law, so the perceived loudness remains constant as the pan changes.
   */
  pan: number;
}
declare const DEFAULT_GLOBAL_MIDI_PARAMETERS: GlobalMIDIParameter;
//#endregion
//#region src/synthesizer/types.d.ts
/**
 * The synthesizer display system exclusive data, EXCLUDING THE F0 BYTE!
 */
type DisplayMessageData = number[];
type GlobalMIDIParameterChangeCallback = { [P in keyof GlobalMIDIParameter]: {
  /**
   * The parameter that was changed.
   */
  parameter: P;
  /**
   * The new value of this parameter.
   */
  value: GlobalMIDIParameter[P];
} }[keyof GlobalMIDIParameter];
type FXType<K> = Exclude<keyof K, "process" | "getSnapshot"> | "macro";
type EffectChangeCallback = {
  /**
   * The effect that was changed, "reverb", "chorus", "delay" or "insertion"
   */
  effect: "reverb";
  /**
   * The parameter type or "macro".
   */
  parameter: FXType<ReverbProcessor>;
  /**
   * The new 7-bit value.
   */
  value: number;
} | {
  /**
   * The effect that was changed, "reverb", "chorus", "delay" or "insertion"
   */
  effect: "chorus";
  /**
   * The parameter type or "macro".
   */
  parameter: FXType<ChorusProcessor>;
  /**
   * The new 7-bit value.
   */
  value: number;
} | {
  /**
   * The effect that was changed, "reverb", "chorus", "delay" or "insertion"
   */
  effect: "delay";
  /**
   * The parameter type or "macro".
   */
  parameter: FXType<DelayProcessor>;
  /**
   * The new 7-bit value.
   */
  value: number;
} | {
  /**
   * The effect that was changed, "reverb", "chorus", "delay" or "insertion"
   */
  effect: "insertion";
  /**
   * The parameter that was changed. This maps to GS address map at addr2 = 0x03.
   * See SC-8850 Manual p.237,
   * for example:
   * - 0x0 - EFX type, the value is 16 bit in this special case. Note that this resets the parameters!
   * - 0x3 - EFX param 1
   * - 0x16 - EFX param 20 (usually level)
   * - 0x17 - EFX send to reverb
   */
  parameter: number;
  /**
   * The new value for the parameter.
   */
  value: number;
};
interface SynthProcessorEventData {
  /**
   * This event fires when a note is played.
   */
  noteOn: NoteOnCallback;
  /**
   * This event fires when a note is released.
   */
  noteOff: NoteOffCallback;
  /**
   * This event fires when a controller is changed.
   */
  controllerChange: ControllerChangeCallback;
  /**
   * This event fires when a program is changed.
   */
  programChange: ProgramChangeCallback;
  /**
   * This event fires when a polyphonic pressure is changed.
   */
  polyPressure: PolyPressureCallback;
  /**
   * This event fires when all notes on a channel are stopped.
   */
  stopAll: StopAllCallback;
  /**
   * This event fires when a new channel is created. There is no data for this event.
   */
  channelAdded: void;
  /**
   * This event fires when the preset list is changed.
   */
  presetListChange: MIDIPatchFull[];
  /**
   * This event fires when the synthesizer is reset.
   */
  reset: MIDISystem;
  /**
   * This event fires when the synthesizer receives a display message.
   */
  displayMessage: DisplayMessageData;
  /**
   * This event fires when a global MIDI parameter changes.
   */
  globalParamChange: GlobalMIDIParameterChangeCallback;
  /**
   * This event fires when a channel MIDI parameter changes.
   */
  channelParamChange: ChannelMIDIParameterChange;
  /**
   * This event fires when an effect processor is modified.
   */
  effectChange: EffectChangeCallback;
}
type SynthProcessorEvent = { [K in keyof SynthProcessorEventData]: {
  type: K;
  data: SynthProcessorEventData[K];
} }[keyof SynthProcessorEventData];
interface SynthMethodOptions {
  /**
   * The audio context time when the event should execute, in seconds.
   */
  time: number;
}
/**
 * Looping mode of the sample.
 * 0 - no loop.
 * 1 - loop.
 * 2 - UNOFFICIAL: polyphone 2.4 added start on release.
 * 3 - loop then play when released.
 */
type SampleLoopingMode = 0 | 1 | 2 | 3;
/**
 * A list of voices for a given key:velocity.
 */
type CachedVoiceList = CachedVoice[];
interface SynthProcessorOptions {
  /**
   * The maximum buffer size the synthesizer can render at once.
   * Attempting to `.process()` more samples than this will result in an error.
   * Defaults to 128.
   */
  maxBufferSize: number;
  /**
   * If the synthesizer processes the audio effects.
   * This can be changed later.
   */
  effectsEnabled: boolean;
  /**
   * If the event system is enabled.
   * This can be changed later.
   */
  eventsEnabled: boolean;
  /**
   * The initial time of the synth, in seconds.
   */
  initialTime: number;
  /**
   * Reverb processor for the synthesizer. Leave undefined to use the default.
   */
  reverbProcessor?: ReverbProcessor;
  /**
   * Chorus processor for the synthesizer. Leave undefined to use the default.
   */
  chorusProcessor?: ChorusProcessor;
  /**
   * Delay processor for the synthesizer. Leave undefined to use the default.
   */
  delayProcessor?: DelayProcessor;
}
//#endregion
//#region src/synthesizer/audio_engine/voice/wavetable_oscillator.d.ts
/**
 * Wavetable_oscillator.ts
 * purpose: plays back raw audio data at an arbitrary playback rate
 */
declare abstract class WavetableOscillator {
  /**
   * Is the loop on?
   */
  isLooping: boolean;
  /**
   * Sample data of the voice.
   */
  sampleData?: Float32Array;
  /**
   * Playback step (rate) for sample pitch correction.
   */
  playbackStep: number;
  /**
   * Start position of the loop.
   * Inclusive.
   */
  loopStart: number;
  /**
   * End position of the loop.
   * Exclusive.
   */
  loopEnd: number;
  /**
   * Length of the loop.
   * @private
   */
  loopLength: number;
  /**
   * End position of the sample.
   * Exclusive
   */
  end: number;
  /**
   * The current cursor of the sample.
   */
  cursor: number;
  /**
   * Fills the output buffer with raw sample data using a given interpolation.
   * @param sampleCount The amount of samples to write into the buffer.
   * @param tuningRatio the tuning ratio to apply.
   * @param outputBuffer The output buffer to write to.
   */
  abstract process(sampleCount: number, tuningRatio: number, outputBuffer: Float32Array): boolean;
}
//#endregion
//#region src/synthesizer/audio_engine/voice/voice.d.ts
/**
 * Voice represents a single instance of the
 * SoundFont2 synthesis model.
 * That is:
 * A wavetable oscillator (sample)
 * A volume envelope (volEnv)
 * A modulation envelope (modEnv)
 * Generators (generators and modulatedGenerators)
 * Modulators (modulators)
 * And MIDI params such as channel, MIDI note, velocity
 */
declare class Voice {
  /**
   * All oscillators currently available to the voice.
   */
  readonly oscillators: Record<InterpolationType, WavetableOscillator>;
  /**
   * The oscillator currently used by this voice.
   */
  wavetable: WavetableOscillator;
  /**
   * Lowpass filter applied to the voice.
   */
  readonly filter: LowpassFilter;
  /**
   * The unmodulated (copied to) generators of the voice.
   */
  readonly generators: Int16Array<ArrayBuffer>;
  /**
   * The generators in real-time, affected by modulators.
   * This is used during rendering.
   */
  readonly modulatedGenerators: Int16Array<ArrayBuffer>;
  /**
   * The voice's modulators.
   */
  modulators: VoiceModulator[];
  /**
   * The current values for the respective modulators.
   * If there are more modulators, the array must be resized.
   */
  modulatorValues: Int16Array<ArrayBuffer>;
  /**
   * Modulation envelope.
   */
  readonly modEnv: ModulationEnvelope;
  /**
   * Volume envelope.
   */
  readonly volEnv: VolumeEnvelope;
  /**
   * Resonance offset, it is affected by the default resonant modulator
   */
  resonanceOffset: number;
  /**
   * Priority of the voice. Used for stealing.
   */
  priority: number;
  /**
   * If the voice is currently active.
   * If not, it can be used.
   */
  isActive: boolean;
  /**
   * Indicates if the voice has rendered at least one buffer.
   * Used for exclusive class to prevent killing voices set on the same note.
   */
  hasRendered: boolean;
  /**
   * Indicates if the voice is in the release phase.
   */
  isInRelease: boolean;
  /**
   * Indicates if the voice is currently held by the sustain pedal.
   */
  isHeld: boolean;
  /**
   * MIDI channel number of the voice.
   */
  channel: number;
  /**
   * Grouping voices for specific Note On messages.
   * Used for overlapping Note Ons.
   */
  noteID: number;
  /**
   * MIDI note number of the voice.
   * Direct number from the Note On message and is
   * used for Note Off and external parameters:
   * MTS and Per note Pitch Wheel.
   */
  midiNote: number;
  /**
   * Target key of the voice.
   * This is the effective MIDI note number,
   * used to calculate scale tuning and envelope times,
   * and can be overridden by generators.
   * It is also used
   */
  targetKey: number;
  /**
   * MIDI Velocity of the voice.
   * This can be overridden by generators and is the effective velocity.
   * MIDI Note On velocity is only used for zone filtering.
   */
  velocity: number;
  /**
   * The root key of the voice.
   */
  rootKey: number;
  /**
   * The pressure of the voice
   */
  pressure: number;
  /**
   * Linear gain of the voice. Used with Key Modifiers.
   */
  gainModifier: number;
  /**
   * Looping mode of the sample:
   * 0 - no loop
   * 1 - loop
   * 2 - UNOFFICIAL: polyphone 2.4 added start on release
   * 3 - loop then play when released
   */
  loopingMode: SampleLoopingMode;
  /**
   * Start time of the voice, absolute.
   */
  startTime: number;
  /**
   * Start time of the release phase, absolute.
   */
  releaseStartTime: number;
  /**
   * Current tuning in cents.
   */
  tuningCents: number;
  /**
   * Current calculated tuning. (as in ratio)
   */
  tuningRatio: number;
  /**
   * From -500 to 500. Used for smoothing.
   */
  currentPan: number;
  /**
   * Initial key to glide from, MIDI Note number. If -1, the portamento is OFF.
   */
  portamentoFromKey: number;
  /**
   * Duration of the linear glide, in seconds.
   */
  portamentoDuration: number;
  /**
   * From -500 to 500, where zero means disabled (use the channel pan). Used for random pan.
   */
  overridePan: number;
  /**
   * In cents.
   */
  pitchOffset: number;
  /**
   * Reverb send of the voice, used for drum parts, otherwise 1.
   */
  reverbSend: number;
  /**
   * Chorus send of the voice, used for drum parts, otherwise 1.
   */
  chorusSend: number;
  /**
   * Delay send of the voice, used for drum parts, otherwise 1.
   */
  delaySend: number;
  /**
   * Exclusive class number for hi-hats etc.
   */
  exclusiveClass: number;
  /**
   * In timecents, where zero means disabled (use the modulatedGenerators table).
   * Used for exclusive notes and killing notes.
   */
  overrideReleaseVolEnv: number;
  vibLfoPhase: number;
  vibLfoStartTime: number;
  modLfoPhase: number;
  modLfoStartTime: number;
  constructor(sampleRate: number, bufferSize: number);
  /**
   * Releases the voice as exclusiveClass.
   */
  exclusiveRelease(currentTime: number, minExclusiveLength?: number): void;
  /**
   * Stops the voice
   * @param currentTime
   * @param minNoteLength minimum note length in seconds
   */
  releaseVoice(currentTime: number, minNoteLength?: number): void;
  setup(currentTime: number, channel: number, midiNote: number, noteID: number): void;
}
//#endregion
//#region src/soundbank/basic_soundbank/modulator_source.d.ts
declare class ModulatorSource {
  /**
   * If this field is set to false, the controller should be mapped with a minimum value of 0 and a maximum value of 1. This is also
   * called Unipolar. Thus, it behaves similar to the Modulation Wheel controller of the MIDI specification.
   *
   * If this field is set to true, the controller should be mapped with a minimum value of -1 and a maximum value of 1. This is also
   * called Bipolar. Thus, it behaves similar to the Pitch Wheel controller of the MIDI specification.
   */
  isBipolar: boolean;
  /**
   * If this field is set true, the direction of the controller should be from the maximum value to the minimum value. So, for
   * example, if the controller source is Key Number, then a Key Number value of 0 corresponds to the maximum possible
   * controller output, and the Key Number value of 127 corresponds to the minimum possible controller input.
   */
  isNegative: boolean;
  /**
   * The index of the source.
   * It can point to one of the MIDI controllers or one of the predefined sources, depending on the 'isCC' flag.
   */
  index: ModulatorSourceIndex;
  /**
   * If this field is set to true, the MIDI Controller Palette is selected. The ‘index’ field value corresponds to one of the 128
   * MIDI Continuous Controller messages as defined in the MIDI specification.
   */
  isCC: boolean;
  /**
   * This field specifies how the minimum value approaches the maximum value.
   */
  curveType: ModulatorCurveType;
  private get sourceName();
  private get curveTypeName();
  static fromSourceEnum(sourceEnum: number): ModulatorSource;
  /**
   * Copies the modulator source.
   * @param source The source to copy from.
   * @returns the copied source.
   */
  static copyFrom(source: ModulatorSource): ModulatorSource;
  toString(): string;
  toSourceEnum(): number;
  isIdentical(source: ModulatorSource): boolean;
  /**
   * Gets the current value from this source.
   * @param channel the MIDI channel to compute for.
   * @param pitchWheel the pitch wheel value, as channel determines if it's a per-note or a global value.
   * @param voice The voice to get the data for.
   */
  getValue(channel: SF2Channel, pitchWheel: number, voice: Voice): number;
}
//#endregion
//#region src/soundbank/soundfont/write/types.d.ts
/**
 * Write indexes for tracking writing a SoundFont file.
 */
interface SoundFontWriteIndexes {
  /**
   * Generator start index.
   */
  gen: number;
  /**
   * Modulator start index.
   */
  mod: number;
  /**
   * Zone start index.
   */
  bag: number;
  /**
   * Preset/instrument start index.
   */
  hdr: number;
}
//#endregion
//#region src/soundbank/basic_soundbank/modulator.d.ts
declare class Modulator {
  /**
   * The generator destination of this modulator.
   */
  destination: GeneratorType;
  /**
   * The transform amount for this modulator.
   */
  transformAmount: number;
  /**
   * The transform type for this modulator.
   */
  transformType: ModulatorTransformType;
  /**
   * The primary source of this modulator.
   */
  readonly primarySource: ModulatorSource;
  /**
   * The secondary source of this modulator.
   */
  readonly secondarySource: ModulatorSource;
  /**
   * Creates a new SF2 Modulator
   */
  constructor(primarySource?: ModulatorSource, secondarySource?: ModulatorSource, destination?: GeneratorType, amount?: number, transformType?: ModulatorTransformType);
  private get destinationName();
  /**
   * Checks if the pair of modulators is identical (in SF2 terms)
   * @param mod1 modulator 1
   * @param mod2 modulator 2
   * @param checkAmount if the amount should be checked too.
   * @returns if they are identical
   */
  static isIdentical(mod1: Modulator, mod2: Modulator, checkAmount?: boolean): boolean;
  /**
   * Copies a modulator.
   * @param mod The modulator to copy.
   * @returns The copied modulator.
   */
  static copyFrom(mod: Modulator): Modulator;
  toString(): string;
  write(modData: IndexedByteArray, indexes?: SoundFontWriteIndexes): void;
  /**
   * Sums transform and create a NEW modulator
   * @param modulator the modulator to sum with
   * @returns the new modulator
   */
  sumTransform(modulator: Modulator): Modulator;
}
//#endregion
//#region src/soundbank/basic_soundbank/basic_soundbank.d.ts
/**
 * Represents a single sound bank, be it DLS or SF2.
 */
declare class BasicSoundBank {
  /**
   * Indicates if the SF3/SF2Pack decoder is ready.
   */
  static isSF3DecoderReady: Promise<void>;
  /**
   * The type of the sound bank that was loaded.
   * Either `sf2` for SoundFont2/SoundFont3 or `dls` for DownLoadable Sounds or `sfe` for SF-Enhanced.
   *
   * Please note that SF3 or SFOGG files are parsed as `sf2` files, but with compressed samples.
   * The type is still `sf2`.
   */
  readonly type: "sf2" | "dls" | "sfe";
  /**
   * Sound bank's info.
   */
  soundBankInfo: SoundBankInfoData;
  /**
   * The sound bank's presets.
   */
  presets: BasicPreset[];
  /**
   * The sound bank's samples.
   */
  samples: BasicSample[];
  /**
   * The sound bank's instruments.
   */
  instruments: BasicInstrument[];
  /**
   * Sound bank's default modulators.
   */
  defaultModulators: Modulator[];
  /**
   * If the sound bank has custom default modulators (DMOD).
   */
  customDefaultModulators: boolean;
  constructor(type?: "sf2" | "sfe" | "dls");
  private _isXGBank;
  /**
   * Checks for XG drum sets and considers if this sound bank is XG.
   */
  get isXGBank(): boolean;
  /**
   * Merges sound banks with the given order. Keep in mind that the info read is copied from the first one
   * @param soundBanks the sound banks to merge, the first overwrites the last
   */
  static mergeSoundBanks(...soundBanks: BasicSoundBank[]): BasicSoundBank;
  /**
   * Creates a simple sound bank with one saw wave preset.
   */
  static getSampleSoundBankFile(): ArrayBuffer;
  /**
   * Copies a given sound bank.
   * @param bank The sound bank to copy.
   */
  static copyFrom(bank: BasicSoundBank): BasicSoundBank;
  /**
   * Adds complete presets along with their instruments and samples.
   * @param presets The presets to add.
   */
  addCompletePresets(presets: BasicPreset[]): void;
  /**
   * Sets the sound bank's sample format _in place_.
   * @param options options for writing the file.
   */
  setSampleFormat(options: SetSampleFormatOptions): Promise<void>;
  /**
   * Write the sound bank as a .dls file. This may not be 100% accurate.
   * Note that samples are always written in the s16le PCM encoding.
   * @param options options for writing the file.
   * @returns the binary file.
   */
  writeDLS(options?: Partial<DLSWriteOptions>): ArrayBuffer;
  /**
   * Writes the sound bank as an SF2 file.
   * @param writeOptions the options for writing.
   * @returns the binary file data.
   */
  writeSF2(writeOptions?: Partial<SoundFont2WriteOptions>): ArrayBuffer;
  /**
   * Writes the sound bank as an [SFE 4](https://sfe-team-was-taken.github.io/SFE/) file.
   * This enables features such as bank LSB and RIFF64.
   * Note that spessasynth is currently the only software that can read these files.
   * @param writeOptions the options for writing.
   * @returns the binary file data.
   */
  writeSFE(writeOptions?: Partial<SFEWriteOptions>): ArrayBuffer;
  addPresets(...presets: BasicPreset[]): void;
  addInstruments(...instruments: BasicInstrument[]): void;
  addSamples(...samples: BasicSample[]): void;
  /**
   * Clones a sample into this bank.
   * @param sample The sample to copy.
   * @returns the copied sample, if a sample exists with that name, it is returned instead
   */
  cloneSample(sample: BasicSample): BasicSample;
  /**
   * Recursively clones an instrument into this sound bank, as well as its samples.
   * @returns the copied instrument, if an instrument exists with that name, it is returned instead.
   */
  cloneInstrument(instrument: BasicInstrument): BasicInstrument;
  /**
   * Recursively clones a preset into this sound bank, as well as its instruments and samples.
   * @returns the copied preset, if a preset exists with that name, it is returned instead.
   */
  clonePreset(preset: BasicPreset): BasicPreset;
  /**
   * Updates internal values.
   */
  flush(): void;
  /**
   * Trims the sound bank _in-place_ to only contain samples in a given MIDI file.
   * @param presetData - A `Map`: `BasicPreset` -> `Set<"key-velocity">`.
   * Absent presets will be removed from the sound bank,
   * and samples that don't get activated in the remaining presets will be removed as well.
   */
  trim(presetData: PresetsWithKeyCombinations): void;
  removeUnusedElements(): void;
  deleteInstrument(instrument: BasicInstrument): void;
  deletePreset(preset: BasicPreset): void;
  deleteSample(sample: BasicSample): void;
  /**
   * Get the appropriate preset.
   */
  getPreset(patch: MIDIPatch, system: MIDISystem): BasicPreset;
  destroySoundBank(): void;
  protected parsingError(error: string): void;
  /**
   * Parses the bank after loading is done
   * @protected
   */
  protected parseInternal(): void;
  protected printInfo(): void;
}
//#endregion
//#region src/soundbank/downloadable_sounds/enums.d.ts
declare const DLSLoopTypes: {
  readonly forward: 0;
  readonly loopAndRelease: 1;
};
type DLSLoopType = (typeof DLSLoopTypes)[keyof typeof DLSLoopTypes];
//#endregion
//#region src/soundbank/types.d.ts
interface SoundBankManagerListEntry {
  /**
   * The unique string identifier of the sound bank.
   */
  id: string;
  /**
   * The sound bank itself.
   */
  soundBank: BasicSoundBank;
  /**
   * The bank MSB offset for this sound bank.
   */
  bankOffset: number;
}
interface SF2Channel {
  /**
   * All MIDI controller values for modulation.
   */
  midiControllers: Int16Array;
  /**
   * Other MIDI parameters.
   */
  midiParameters: {
    /**
     * Channel Pressure.
     */
    pressure: number;
    /**
     * 0-16,383
     */
    pitchWheel: number;
    /**
     * Semitones, can be a floating point number.
     */
    pitchWheelRange: number;
  };
}
interface SF2VersionTag {
  /**
   * The major revision number of the sound bank.
   */
  major: number;
  /**
   * The minor revision number of this sound bank.
   */
  minor: number;
}
type GenericBankInfoFourCC = "INAM" | "ICRD" | "IENG" | "IPRD" | "ICOP" | "ICMT" | "ISFT";
type SF2InfoFourCC = GenericBankInfoFourCC | "ifil" | "isng" | "irom" | "iver" | "DMOD" | "LIST";
type SF2ChunkFourCC = "pdta" | "xdta" | "sdta" | "smpl" | "sm24" | "phdr" | "pbag" | "pmod" | "pgen" | "inst" | "ibag" | "imod" | "igen" | "shdr";
type DLSInfoFourCC = GenericBankInfoFourCC | "ISBJ";
type DLSChunkFourCC = WAVFourCC | "dls " | "dlid" | "cdl " | "ptbl" | "vers" | "colh" | "wvpl" | "wsmp" | "data" | "lart" | "lar2" | "art2" | "art1" | "lrgn" | "rgnh" | "wlnk" | "lins" | "ins " | "insh" | "rgn " | "rgn2" | "pgal";
interface SoundBankInfoData {
  /**
   * Name.
   */
  name: string;
  /**
   * The sound bank's version.
   */
  version: SF2VersionTag;
  /**
   * Creation date.
   */
  creationDate: Date;
  /**
   * Sound engine.
   */
  soundEngine: string;
  /**
   * Author.
   */
  engineer?: string;
  /**
   * Product.
   */
  product?: string;
  /**
   * Copyright.
   */
  copyright?: string;
  /**
   * Comment.
   */
  comment?: string;
  /**
   * Software used to edit the file.
   */
  software?: string;
  /**
   * Subject.
   */
  subject?: string;
  /**
   * ROM information.
   */
  romInfo?: string;
  /**
   * A tag that only applies to SF2 and will usually be undefined.
   */
  romVersion?: SF2VersionTag;
}
type SoundBankInfoFourCC = keyof SoundBankInfoData;
interface VoiceParameters {
  generators: Int16Array;
  modulators: Modulator[];
  sample: BasicSample;
}
type SampleEncodingFunction = (audioData: Float32Array, sampleRate: number) => Promise<Uint8Array>;
type ModulatorSourceIndex = ModulatorControllerSource | MIDIController;
/**
 * A function to track progress during writing.
 */
type ProgressFunction = (
/**
 * Estimated progress, from 0 to 1.
 */

progress: number) => unknown;
type SetSampleFormatOptions = {
  /**
   * A function to show progress for compressing. It can be undefined.
   */
  progressFunction?: ProgressFunction;
} & ({
  /**
   * The sample format to use.
   * - `pcm` - decompresses the sound bank and changes its version to `2.04` (SF2)
   * - `compressed` - compresses the sound bank with a given function and changes its version to `3.0` (SF3)
   *
   * Note that decompressing usually results in permanent sample quality loss!
   */
  format: "pcm";
} | {
  /**
   * The sample format to use.
   * - `pcm` - decompresses the sound bank and changes its version to `2.04` (SF2)
   * - `compressed` - compresses the sound bank with a given function and changes its version to `3.0` (SF3)
   *
   * Note that decompressing usually results in permanent sample quality loss!
   */
  format: "compressed";
  /**
   * The function for compressing samples.
   */
  compressionFunction: SampleEncodingFunction;
});
interface SoundBankWriteOptions {
  /**
   * The `ISFT` field to set when writing. If unset, `SpessaSynth` is written.
   * This field indicates the last software that was used to edit this sound bank.
   */
  software: string;
  /**
   * A function for long operations. It can be undefined.
   */
  progressFunction?: ProgressFunction;
}
/**
 * Options for writing a SoundFont2 file.
 */
interface SoundFont2WriteOptions extends SoundBankWriteOptions {
  /**
   * If the DMOD chunk should be written. Recommended.
   * Note that it will only be written if the modulators are unchanged.
   */
  writeDefaultModulators: boolean;
  /**
   * If the XDTA chunk should be written to allow virtually infinite parameters. Recommended.
   * Note that it will only be written needed.
   */
  writeExtendedLimits: boolean;
}
/**
 * Options for writing a DLS file.
 */
type DLSWriteOptions = SoundBankWriteOptions;
/**
 * Options for writing an SFE 4 file.
 */
interface SFEWriteOptions extends SoundBankWriteOptions {
  /**
   * If the RIFS (64-bit RIFF chunks) should be used.
   * Increases maximum size from 4GB to effectively infinite.
   * Recommended, since SFE 4 is effectively incompatible with SF2.
   */
  rf64: boolean;
}
interface GenericRange {
  min: number;
  max: number;
}
interface DLSLoop {
  loopType: DLSLoopType;
  /**
   * Specifies the start point of the loop in samples as an absolute offset from the beginning of the
   * data in the <data-ck> subchunk of the <wave-list> wave file chunk.
   */
  loopStart: number;
  /**
   * Specifies the length of the loop in samples.
   */
  loopLength: number;
}
/**
 * - Key - the preset.
 * - Value - A Map:
 *   - Key: The MIDI note number.
 *   - Value: A set of matching velocities for this note number.
 */
type PresetsWithKeyCombinations = Map<BasicPreset, Map<number, Set<number>>>;
type MIDISystem = "gm" | "gm2" | "gs" | "xg";
//#endregion
//#region src/utils/riff_chunk.d.ts
type GenericRIFFFourCC = "RIFF" | "RIFS" | "LIST" | "INFO";
type WAVFourCC = "wave" | "cue " | "fmt ";
type FourCC = GenericRIFFFourCC | SoundBankInfoFourCC | SF2InfoFourCC | SF2ChunkFourCC | DLSInfoFourCC | DLSChunkFourCC | RMIDInfoFourCC | WAVFourCC;
//#endregion
//#region src/utils/exports.d.ts
declare const SpessaSynthCoreUtils: {
  ConsoleColors: {
    warn: string;
    unrecognized: string;
    info: string;
    recognized: string;
    value: string;
  };
  readBigEndian: typeof readBigEndian;
  readLittleEndian: typeof readLittleEndian;
  readLittleEndianIndexed: typeof readLittleEndianIndexed;
  readBinaryString: typeof readBinaryString;
  readBinaryStringIndexed: typeof readBinaryStringIndexed;
  readVariableLengthQuantity: typeof readVariableLengthQuantity;
  inflateSync: (input: Uint8Array) => Uint8Array<ArrayBuffer>;
};
interface WaveWriteOptions {
  /**
   * This will find the max sample point and set it to 1, and scale others with it. Recommended
   */
  normalizeAudio: boolean;
  /**
   * The loop start and end points in seconds. Undefined if no loop should be written.
   */
  loop?: {
    /**
     * The start point in seconds.
     */
    start: number;
    /**
     * The end point in seconds.
     */
    end: number;
  };
  /**
   * The metadata to write into the file.
   */
  metadata: Partial<WaveMetadata>;
}
interface WaveMetadata {
  /**
   * The song's title.
   */
  title: string;
  /**
   * The song's artist.
   */
  artist: string;
  /**
   * The song's album.
   */
  album: string;
  /**
   * The song's genre.
   */
  genre: string;
}
//#endregion
//#region src/midi/midi_tools/modify_midi.d.ts
/**
 * Represents a value that means "clear this parameter" instead of "replace this parameter with".
 * Essentially:
 * - undefined - no change.
 * - `clear` - clear all changes of this parameter from the MIDI file.
 * - T - clear all changes of this parameter from the MIDI file and add T.
 */
type ClearableParameter<T> = T | "clear";
interface ChannelModification {
  /**
   * All controllers that should be modified for this channel.
   * - Key: the MIDI controller number.
   * - value:
   *   - `"clear"` - all controller changes for this controller are removed.
   *   - `number` - clear + sets the new controller at the start of the song, effectively locking them to the set value.
   */
  controllers?: Map<MIDIController, ClearableParameter<number>>;
  /**
   * The new program of this channel.
   * - `"clear"` - all program changes for this channel are removed.
   * - `MIDIPatch` - clear + sets the new patch according to the MIDI system at the start of the sequence.
   */
  patch?: ClearableParameter<MIDIPatch>;
  /**
   * The new MIDI parameters of this channel.
   * - Key: the MIDI parameter name.
   * - value:
   *   - `"clear"` - all changes for this parameter are removed.
   *   - `specific value` - clear + sets the new parameter at the start of the song, effectively locking them to the set value.
   */
  midiParams?: { [P in keyof ChannelMIDIParameter]?: ClearableParameter<ChannelMIDIParameter[P]> };
  /**
   * The channel key shift in semitones.
   * Note on/off numbers are shifted.
   *
   * This differs from the `keyShift` MIDI Parameter in that it shifts the actual note numbers,
   * and doesn't delete or overwrite existing shifts.
   */
  keyShift?: number;
  /**
   * The channel tuning in cents.
   * Tuned using RPN Fine Tune.
   * Range is `[-100; 99.986]` cents.
   *
   * This differs from the `fineTune` MIDI Parameter
   * in that it is relative to the tuning applied in the MIDI file,
   * and it does not overwrite it.
   */
  fineTune?: number;
}
interface ModifyMIDIOptions {
  /**
   * The channel changes.
   * - Key: the MIDI channel number.
   * - value:
   *   - `"clear"` - all MIDI messages for this channel, such as Note On are removed.
   *   - `ChannelModification` - modifies the channel.
   */
  channels?: Map<number, ClearableParameter<ChannelModification>>;
  /**
   * The drum parameter changes.
   * - `"clear"` - all existing drum parameter change MIDI messages are removed.
   * - `never` - not yet implemented.
   */
  drumSetupParams?: ClearableParameter<never>;
  /**
   * The global MIDI parameter changes.
   * - Key: the MIDI parameter name.
   * - value:
   *   - `"clear"` - all changes for this parameter are removed.
   *   - `specific value` - clear + sets the new parameter at the start of the song, effectively locking them to the set value.
   *
   * Please note that `"clear"` is not supported for the `system` parameter,
   * as it may cause issues with the MIDI system detection and reset insertion.
   */
  midiParams?: { [P in keyof GlobalMIDIParameter]?: ClearableParameter<GlobalMIDIParameter[P]> };
  /**
   * The desired GS reverb parameters.
   * - `"clear"` - all existing parameter change MIDI messages are removed.
   * - `ReverbProcessorSnapshot` - clear + the new parameters are set via System Exclusive messages.
   */
  reverbParams?: ClearableParameter<ReverbProcessorSnapshot>;
  /**
   * The GS chorus parameters.
   * - `"clear"` - all existing parameter change MIDI messages are cleared.
   * - `ChorusProcessorSnapshot` - clear + the new parameters are set via System Exclusive messages.
   */
  chorusParams?: ClearableParameter<ChorusProcessorSnapshot>;
  /**
   * The GS delay parameters.
   * - `"clear"` - all existing parameter change MIDI messages are cleared.
   * - `DelayProcessorSnapshot` - clear + the new parameters are set via System Exclusive messages.
   */
  delayParams?: ClearableParameter<DelayProcessorSnapshot>;
  /**
   * The GS Insertion Effect parameters.
   * - `"clear"` - all existing parameter change MIDI messages are cleared.
   * - `InsertionProcessorSnapshot` - clear + the new parameters are set via System Exclusive messages.
   */
  insertionParams?: ClearableParameter<InsertionProcessorSnapshot>;
}
//#endregion
//#region src/midi/midi_track.d.ts
declare class MIDITrack {
  /**
   * The name of this track.
   */
  name: string;
  /**
   * The MIDI port number used by the track.
   */
  port: number;
  /**
   * A set that contains the MIDI channels used by the track in the sequence.
   */
  channels: Set<number>;
  /**
   * All the MIDI messages of this track.
   */
  events: Omit<MIDIMessage[], "push" | "splice" | "shift" | "unshift">;
  static copyFrom(track: MIDITrack): MIDITrack;
  copyFrom(track: MIDITrack): void;
  /**
   * Adds an event to the track.
   * @param event The event to add.
   * @param index The index at which to add this event.
   * @deprecated Use addEvents instead
   */
  addEvent(event: MIDIMessage, index: number): void;
  /**
   * Adds events to the track.
   * @param index The index at which to add these event.
   * @param events The events to add.
   */
  addEvents(index: number, ...events: MIDIMessage[]): void;
  /**
   * Removes an event from the track.
   * @param index The index of the event to remove.
   */
  deleteEvent(index: number): void;
  /**
   * Appends an event to the end of the track.
   * @param event The event to add.
   */
  pushEvent(event: MIDIMessage): void;
}
//#endregion
//#region src/midi/basic_midi.d.ts
/**
 * BasicMIDI is the base of a complete MIDI file.
 */
declare class BasicMIDI {
  /**
   * The tracks in the sequence.
   */
  tracks: MIDITrack[];
  /**
   * A flattened, time‑sorted list of all events in the MIDI sequence.
   * The order between the tracks is preserved.
   * Each entry points to the event's track number and its index within that track.
   * This is the recommended way of iterating over the MIDI sequence's events.
   *
   * Do not change this array.
   */
  readonly timeline: readonly Readonly<TimelineEvent>[];
  /**
   * The time division of the sequence, representing the number of MIDI ticks per beat.
   */
  timeDivision: number;
  /**
   * The duration of the sequence, in seconds.
   */
  duration: number;
  /**
   * The tempo changes in the sequence, ordered from the last change to the first.
   * Each change is represented by an object with a MIDI tick position and a tempo value in beats per minute.
   */
  tempoChanges: TempoChange[];
  /**
   * Any extra metadata found in the file.
   * These messages were deemed "interesting" by the parsing algorithm
   */
  extraMetadata: MIDIMessage[];
  /**
   * An array containing the lyrics of the sequence.
   */
  lyrics: MIDIMessage[];
  /**
   * The tick position of the first note-on event in the MIDI sequence.
   */
  firstNoteOn: number;
  /**
   * The MIDI key range used in the sequence, represented by a minimum and maximum note value.
   */
  keyRange: GenericRange;
  /**
   * The tick position of the last voice event (such as note-on, note-off, or control change) in the sequence.
   */
  lastVoiceEventTick: number;
  /**
   * An array of channel offsets for each MIDI port, using the SpessaSynth method.
   * The index is the port number and the value is the channel offset.
   */
  portChannelOffsetMap: number[];
  /**
   * The loop points (in ticks) of the sequence, including both start and end points.
   */
  loop: MIDILoop;
  /**
   * The file name of the MIDI sequence, if provided during parsing.
   */
  fileName?: string;
  /**
   * The format of the MIDI file, which can be 0, 1, or 2, indicating the type of the MIDI file.
   */
  format: MIDIFormat;
  /**
   * The RMID (Resource-Interchangeable MIDI) info data, if the file is RMID formatted.
   * Otherwise, this object is empty.
   * Info type: Chunk data as a binary array.
   * Note that text chunks contain a terminal zero byte.
   */
  rmidiInfo: Partial<Record<keyof RMIDInfoData, Uint8Array<ArrayBuffer>>>;
  /**
   * The bank offset used for RMID files.
   */
  bankOffset: number;
  /**
   * If the MIDI file is a Soft Karaoke file (.kar), this is set to true.
   * https://www.mixagesoftware.com/en/midikit/help/HTML/karaoke_formats.html
   */
  isKaraokeFile: boolean;
  /**
   * Indicates if this file is a Multi-Port MIDI file.
   */
  isMultiPort: boolean;
  /**
   * If the MIDI file is a DLS RMIDI file.
   */
  isDLSRMIDI: boolean;
  /**
   * The embedded sound bank in the MIDI file, represented as an ArrayBuffer, if available.
   */
  embeddedSoundBank?: ArrayBuffer;
  /**
   * The raw, encoded MIDI name, represented as a Uint8Array.
   * Useful when the MIDI file uses a different code page.
   * Undefined if no MIDI name could be found.
   */
  protected binaryName?: Uint8Array;
  /**
   * The encoding of the RMIDI info in file, if specified.
   */
  get infoEncoding(): string | undefined;
  /**
   * Loads a MIDI file (SMF, RMIDI, XMF) from a given ArrayBuffer.
   * @param arrayBuffer The ArrayBuffer containing the binary file data.
   * @param fileName The optional name of the file, will be used if the MIDI file does not have a name.
   * @remarks
   * This function reads the MIDI file format, extracts the header and track chunks,
   * and populates the BasicMIDI instance with the parsed data.
   * It supports Standard MIDI Files (SMF), RIFF MIDI (RMIDI), and Extensible Music Format (XMF).
   * It also handles embedded soundbanks in RMIDI files.
   * If the file is an RMIDI file, it will extract the embedded soundbank and store
   * it in the `embeddedSoundBank` property of the BasicMIDI instance.
   * If the file is an XMF file, it will parse the XMF structure and extract the MIDI data.
   */
  static fromArrayBuffer(arrayBuffer: ArrayBuffer, fileName?: string): BasicMIDI;
  /**
   * Loads a MIDI file (SMF, RMIDI, XMF) from a given file.
   * @param file The file to load.
   */
  static fromFile(file: File): Promise<BasicMIDI>;
  /**
   * Copies a MIDI.
   * @param mid The MIDI to copy.
   * @returns The copied MIDI.
   */
  static copyFrom(mid: BasicMIDI): BasicMIDI;
  /**
   * Copies a MIDI.
   * @param mid The MIDI to copy.
   */
  copyFrom(mid: BasicMIDI): void;
  /**
   * Converts MIDI ticks to time in seconds.
   * @param ticks The time in MIDI ticks.
   * @returns The time in seconds.
   */
  midiTicksToSeconds(ticks: number): number;
  /**
   * Converts seconds to time in MIDI ticks.
   * @param seconds The time in seconds.
   * @returns The time in MIDI ticks.
   */
  secondsToMIDITicks(seconds: number): number;
  /**
   * Gets the used programs and keys for this MIDI file with a given sound bank.
   * @param soundbank the sound bank.
   * @returns The output data is a key-value pair: preset -> Map<midiNote, Set<velocity>>
   */
  getUsedProgramsAndKeys(soundbank: BasicSoundBank | SoundBankManager): PresetsWithKeyCombinations;
  /**
   * Preloads all voices for this sequence in a given synth.
   * This caches all the needed voices for playing back this sequencer, resulting in a smooth playback.
   * The sequencer calls this function by default when loading the songs.
   * @param synth
   */
  preloadSynth(synth: SpessaSynthProcessor): void;
  /**
   * Updates all internal values of the MIDI.
   * @param sortEvents if the events should be sorted by ticks. Recommended to be true.
   */
  flush(sortEvents?: boolean): void;
  /**
   * Calculates all note times in seconds.
   * @param minDrumLength the shortest a drum note (channel 10) can be, in seconds.
   * @returns an array of 16 channels, each channel containing its notes,
   * with their key number, velocity, absolute start time and length in seconds.
   */
  getNoteTimes(minDrumLength?: number): NoteTime[][];
  /**
   * Exports the midi as a standard MIDI file.
   * @returns the binary file data.
   */
  writeMIDI(): ArrayBuffer;
  /**
   * Writes an RMIDI file. Note that this method modifies the MIDI file in-place.
   * @param soundBankBinary the binary sound bank to embed into the file.
   * @param configuration Extra options for writing the file.
   * @returns the binary file data.
   */
  writeRMIDI(soundBankBinary: ArrayBuffer, configuration?: Partial<RMIDIWriteOptions>): ArrayBuffer;
  /**
   * Allows easily modifying the sequence's programs and controllers.
   * This is a very sophisticated method that supports various MIDI systems
   * and inserts/deletes messages appropriately.
   *
   * This modifies the MIDI sequence _in-place_.
   */
  modify(opts: Partial<ModifyMIDIOptions>): void;
  /**
   * Modifies the sequence *in-place* according to the locked presets and controllers in the given snapshot.
   *
   * Note that System Parameters `fineTune` and `keyShift` are passed to the relative tuning parameters of the channels.
   * Only locked MIDI parameters and controllers are applied.
   * @param snapshot the snapshot to apply.
   */
  applySnapshot(snapshot: SynthesizerSnapshot): void;
  /**
   * Gets the MIDI's decoded name.
   * @param encoding The encoding to use if the MIDI uses an extended code page.
   * @remarks
   * Do not call in audioWorkletGlobalScope as it uses TextDecoder.
   * RMIDI encoding overrides the provided encoding.
   */
  getName(encoding?: string): string | undefined;
  /**
   * Gets the decoded extra metadata as text and removes any unneeded characters (such as "@T" for karaoke files)
   * @param encoding The encoding to use if the MIDI uses an extended code page.
   * @remarks
   * Do not call in audioWorkletGlobalScope as it uses TextDecoder.
   * RMIDI encoding overrides the provided encoding.
   */
  getExtraMetadata(encoding?: string): string[];
  /**
   * Sets a given RMIDI info value.
   * @param infoType The type to set.
   * @param infoData The value to set it to.
   * @remarks
   * This sets the Info encoding to utf-8.
   */
  setRMIDInfo<K extends keyof RMIDInfoData>(infoType: K, infoData: RMIDInfoData[K]): void;
  /**
   * Gets a given chunk from the RMIDI information, undefined if it does not exist.
   * @param infoType The metadata type.
   * @returns String, Date, ArrayBuffer or undefined.
   */
  getRMIDInfo<K extends keyof RMIDInfoData>(infoType: K): RMIDInfoData[K] | undefined;
  /**
   * Iterates over the MIDI file, ordered by the time the events happen.
   * You probably should use the `timeline` property
   * if you're not mutating the MIDI in the iteration loop.
   * @param callback The callback function to process each event.
   */
  iterate(callback: (event: MIDIMessage, trackNumber: number, eventIndexes: number[]) => unknown): void;
  /**
   * INTERNAL USE ONLY!
   */
  protected copyMetadataFrom(mid: BasicMIDI): void;
  /**
   * Parses internal MIDI values
   */
  protected parseInternal(): void;
}
//#endregion
//#region src/midi/midi_tools/midi_builder.d.ts
interface MIDIBuilderOptions {
  /**
   * The MIDI file's tick precision (how many ticks fit in a quarter note).
   */
  timeDivision: number;
  /**
   * The MIDI file's initial tempo in BPM.
   */
  initialTempo: number;
  /**
   * The MIDI file's MIDI track format.
   */
  format: MIDIFormat;
  /**
   * The MIDI file's name. Will be appended to the conductor track.
   */
  name: string;
}
/**
 * A class that helps to build a MIDI file from scratch.
 */
declare class MIDIBuilder extends BasicMIDI {
  private encoder;
  /**
   * Creates a new MIDI file.
   * @param options The options for writing the file.
   */
  constructor(options?: Partial<MIDIBuilderOptions>);
  /**
   * Adds a new Set Tempo event.
   * @param ticks the tick number of the event.
   * @param tempo the tempo in beats per minute (BPM).
   */
  setTempo(ticks: number, tempo: number): void;
  /**
   * Adds a new MIDI track.
   * @param name the new track's name.
   * @param port the new track's port.
   */
  addTrack(name: string, port?: number): void;
  /**
   * Adds a new MIDI Event.
   * @param ticks the tick time of the event (absolute).
   * @param track the track number to use.
   * @param event the MIDI event number.
   * @param eventData the raw event data.
   */
  addEvent(ticks: number, track: number, event: MIDIMessageType, eventData: ArrayLike<number>): void;
  /**
   * Adds a new Note On event.
   * @param ticks the tick time of the event.
   * @param track the track number to use.
   * @param channel the channel to use.
   * @param midiNote the midi note of the keypress.
   * @param velocity the velocity of the keypress.
   */
  noteOn(ticks: number, track: number, channel: number, midiNote: number, velocity: number): void;
  /**
   * Adds a new Note Off event.
   * @param ticks the tick time of the event.
   * @param track the track number to use.
   * @param channel the channel to use.
   * @param midiNote the midi note of the key release.
   * @param velocity optional and unsupported by spessasynth.
   */
  noteOff(ticks: number, track: number, channel: number, midiNote: number, velocity?: number): void;
  /**
   * Adds a new Program Change event.
   * @param ticks the tick time of the event.
   * @param track the track number to use.
   * @param channel the channel to use.
   * @param programNumber the MIDI program to use.
   */
  programChange(ticks: number, track: number, channel: number, programNumber: number): void;
  /**
   * Adds a new Controller Change event.
   * @param ticks the tick time of the event.
   * @param track the track number to use.
   * @param channel the channel to use.
   * @param controller the MIDI CC to use.
   * @param value the new CC value.
   */
  controllerChange(ticks: number, track: number, channel: number, controller: number, value: number): void;
  /**
   * Adds a new Pitch Wheel event.
   * @param ticks the tick time of the event.
   * @param track the track to use.
   * @param channel the channel to use.
   * @param pitch the pitch (0 - 16383).
   */
  pitchWheel(ticks: number, track: number, channel: number, pitch: number): void;
  /**
   * Adds a new System Exclusive.
   * @param ticks the tick time of the event.
   * @param track the track to use.
   * @param data the System Exclusive data, without the 0xf0 status byte.
   */
  systemExclusive(ticks: number, track: number, data: SysExAcceptedArray): void;
  /**
   * Selects a new Registered Parameter Number.
   * @param ticks the tick time of the events.
   * @param track the track to use.
   * @param channel the channel to use.
   * @param parameter the 14-bit registered parameter number. For example 0 is pitch wheel range.
   * @param value the 14-bit value for this parameter.
   */
  registeredParameter(ticks: number, track: number, channel: number, parameter: number, value: number): void;
  /**
   * Selects a new Non-Registered Parameter Number.
   * @param ticks the tick time of the events.
   * @param track the track to use.
   * @param channel the channel to use.
   * @param parameter the 14-bit non-registered parameter number
   * @param value the 14-bit value for this parameter.
   */
  nonRegisteredParameter(ticks: number, track: number, channel: number, parameter: number, value: number): void;
}
//#endregion
//#region src/midi/midi_tools/midi_utils.d.ts
type GlobalMIDIParameterMessage = { [P in keyof GlobalMIDIParameter]: {
  type: "Global MIDI Param";
  parameter: P;
  value: GlobalMIDIParameter[P];
} }[keyof GlobalMIDIParameter];
type ChannelMIDIParameterMessage = { [P in keyof ChannelMIDIParameter]: {
  type: "Channel MIDI Param";
  parameter: P;
  value: ChannelMIDIParameter[P];
  channel: number;
} }[keyof ChannelMIDIParameter];
type AnalyzedParameter = {
  type: "Other";
} | {
  type: "Controller Change";
  controller: MIDIController;
  value: number;
  channel: number;
} | ChannelMIDIParameterMessage | {
  type: "Drum Setup";
};
type AnalyzedMIDIMessage = AnalyzedParameter | {
  type: "Reverb Param";
} | {
  type: "Chorus Param";
} | {
  type: "Delay Param";
} | {
  type: "Variation Param";
} | {
  type: "Insertion Param";
} | {
  type: "Drums On";
  channel: number;
  isDrum: boolean;
} | {
  type: "Program Change";
  channel: number;
  value: number;
} | {
  type: "Display Data";
} | GlobalMIDIParameterMessage;
/**
 * A general purpose class for handling MIDI messages.
 */
declare class MIDIUtils {
  /**
   * Analyzes a MIDI System Exclusive message
   * and returns an identification and data for it.
   * @param syx the System Exclusive message, WITHOUT the first 0xF0 System Exclusive byte!
   */
  static analyzeSysEx(syx: SysExAcceptedArray): AnalyzedMIDIMessage;
  /**
   * Analyzes a MIDI Registered Parameter Number
   * and returns an identification and data for it.
   * @param channel The MIDI channel number.
   * @param rpn The 14-bit RPN number.
   * @param value The 14-bit value for that number.
   */
  static analyzeRPN(channel: number, rpn: number, value: number): AnalyzedParameter;
  /**
   * Analyzes a MIDI Non-Registered Parameter Number
   * and returns an identification and data for it.
   * @param channel The MIDI channel number.
   * @param nrpn The 14-bit NRPN number.
   * @param value The 14-bit value for that number.
   */
  static analyzeNRPN(channel: number, nrpn: number, value: number): AnalyzedParameter;
  /**
   * Returns a list of MIDI events needed to set the given parameter.
   * @param ticks The ticks for all events.
   * @param system If the message has multiple ways of setting it,
   * this selects the preferred way. Otherwise, it prefers Universal (GM).
   * @param parameter The parameter to set.
   * @param value The value to set it to.
   */
  static setGlobalMIDIParameter<P extends keyof GlobalMIDIParameter>(ticks: number, system: MIDISystem, parameter: P, value: GlobalMIDIParameter[P]): MIDIMessage[];
  /**
   * Returns a list of MIDI events needed to set the given parameter.
   * @param ticks The ticks for all events.
   * @param channel The channel number.
   * @param system If the message has multiple ways of setting it,
   * this selects the preferred way. Otherwise, it prefers Universal (GM).
   * @param parameter The parameter to set.
   * @param value The value to set it to.
   * @returns The list of `MIDIMessage`s that set the parameter.
   */
  static setChannelMIDIParameter<P extends keyof ChannelMIDIParameter>(ticks: number, channel: number, system: MIDISystem, parameter: P, value: ChannelMIDIParameter[P]): MIDIMessage[];
  /**
   * Converts GS/XG "part number" to MIDI channel number.
   * @param part The part number.
   */
  static syxToChannel(part: number): number;
  /**
   * Converts MIDI channel number to GS/XG "part number".
   * @param channel The MIDI channel number.
   */
  static channelToSyx(channel: number): number;
  /**
   * Gets raw GS System Exclusive message bytes, without the 0xF0 status byte.
   * @param a1 Address 1
   * @param a2 Address 2
   * @param a3 Address 3
   * @param data Data, can be multiple bytes.
   */
  static gs(a1: number, a2: number, a3: number, data: number[]): number[];
  /**
   * Gets a GS System Exclusive MIDI message.
   * @param ticks The tick time of the message.
   * @param a1 Address 1
   * @param a2 Address 2
   * @param a3 Address 3
   * @param data Data, can be multiple bytes.
   */
  static gsMessage(ticks: number, a1: number, a2: number, a3: number, data: number[]): MIDIMessage;
  /**
   * Gets raw XG System Exclusive message bytes, without the 0xF0 status byte.
   * @param a1 Address 1
   * @param a2 Address 2
   * @param a3 Address 3
   * @param data Data, can be multiple bytes.
   */
  static xg(a1: number, a2: number, a3: number, data: number[]): number[];
  /**
   * Gets a XG System Exclusive MIDI message.
   * @param ticks The tick time of the message.
   * @param a1 Address 1
   * @param a2 Address 2
   * @param a3 Address 3
   * @param data Data, can be multiple bytes.
   */
  static xgMessage(ticks: number, a1: number, a2: number, a3: number, data: number[]): MIDIMessage;
  /**
   * Gets a raw Device Control System Exclusive message bytes, without the 0xF0 status byte.
   * @param subID The sub ID.
   * @param data Data, can be multiple bytes.
   */
  static deviceControl(subID: number, data: number[]): number[];
  /**
   * Gets a Device Control System Exclusive MIDI message.
   * @param ticks The tick time of the message.
   * @param subID The sub ID.
   * @param data Data, can be multiple bytes.
   */
  static deviceControlMessage(ticks: number, subID: number, data: number[]): MIDIMessage;
  /**
   * Gets a selected reset System Exclusive MIDI message.
   * @param ticks The tick time of the message.
   * @param system The system to reset into.
   */
  static reset(ticks: number, system: MIDISystem): MIDIMessage;
  private static analyzeGM;
  private static analyzeXG;
  private static analyzeGS;
}
//#endregion
//#region src/sequencer/types.d.ts
interface SequencerEventData {
  /**
   * Called when a MIDI message is sent and externalMIDIPlayback is true.
   */
  midiMessage: {
    /**
     * The binary MIDI message.
     */
    message: Iterable<number>;
    /**
     * The synthesizer's current time when this event was sent.
     * Use this for scheduling MIDI messages to your external MIDI device.
     */
    time: number;
  };
  /**
   * Called when the time is changed.
   * It also gets called when a song gets changed.
   */
  timeChange: {
    /**
     * The new time in seconds.
     */
    newTime: number;
  };
  /**
   * Called when the playback stops.
   * @deprecated use songEnded instead.
   */
  pause: {
    /**
     * True if the playback stopped because it finished playing the song, false if it was stopped manually.
     */
    isFinished: boolean;
  };
  /**
   * Called when the playback stops.
   */
  songEnded: object;
  /**
   * Called when the song changes.
   */
  songChange: {
    /**
     * The index of the new song in the song list.
     */
    songIndex: number;
  };
  /**
   * Called when the song list changes.
   */
  songListChange: {
    /**
     * The new song list.
     */
    newSongList: BasicMIDI[];
  };
  /**
   * Called when a MIDI Meta event is encountered.
   */
  metaEvent: {
    /**
     * The MIDI message of the meta event.
     */
    event: MIDIMessage;
    /**
     * The index of the track where the meta event was encountered.
     */
    trackIndex: number;
  };
  /**
   * Called when the loop count changes (decreases).
   */
  loopCountChange: {
    /**
     * The new loop count.
     */
    newCount: number;
  };
}
type SequencerEvent = { [K in keyof SequencerEventData]: {
  type: K;
  data: SequencerEventData[K];
} }[keyof SequencerEventData];
//#endregion
//#region src/sequencer/process_tick.d.ts
/**
 * Processes a single MIDI tick.
 * Call this every rendering quantum to process the sequencer events in real-time.
 */
declare function processTick(this: SpessaSynthSequencer): void;
//#endregion
//#region src/sequencer/set_time_to.d.ts
/**
 * Plays the MIDI file to a specific time or ticks.
 * @param time in seconds.
 * @param ticks optional MIDI ticks, when given is used instead of time.
 * @returns true if the MIDI file is not finished.
 */
declare function setTimeToInternal(this: SpessaSynthSequencer, time: number, ticks?: number | undefined): boolean;
//#endregion
//#region src/sequencer/sequencer.d.ts
declare class SpessaSynthSequencer {
  /**
   * Sequencer's song list.
   */
  songs: BasicMIDI[];
  /**
   * The shuffled song indexes.
   * This is used when shuffle mode is enabled.
   */
  readonly shuffledSongIndexes: number[];
  /**
   * The synthesizer connected to the sequencer.
   */
  readonly synth: SpessaSynthProcessor;
  /**
   * If the MIDI messages should be sent to an event instead of the synth.
   * This is used by spessasynth_lib to pass them over to Web MIDI API.
   */
  externalMIDIPlayback: boolean;
  /**
   * If the notes that were playing when the sequencer was paused should be re-triggered.
   * Defaults to true.
   */
  retriggerPausedNotes: boolean;
  /**
   * The loop count of the sequencer.
   * If set to Infinity, it will loop forever.
   * If set to zero, the loop is disabled.
   */
  loopCount: number;
  /**
   * Indicates if the sequencer should skip to the first note on event.
   * Defaults to true.
   */
  skipToFirstNoteOn: boolean;
  /**
   * Indicates if the sequencer has finished playing.
   */
  isFinished: boolean;
  /**
   * Indicates if the synthesizer should preload the voices for the newly loaded sequence.
   * Recommended.
   */
  preload: boolean;
  /**
   * Called when the sequencer calls an event.
   * @param event The event
   */
  onEventCall?: (event: SequencerEvent) => unknown;
  /**
   * Processes a single MIDI tick.
   * You should call this every rendering quantum to process the sequencer events in real-time.
   */
  processTick: typeof processTick;
  /**
   * The time of the first note in seconds.
   */
  protected firstNoteTime: number;
  /**
   * How long a single MIDI tick currently lasts in seconds.
   */
  protected oneTickToSeconds: number;
  /**
   * The current event index in the sorted event list.
   * This is used to track which event is currently being processed.
   * @protected
   */
  protected index: number;
  /**
   * The time that has already been played in the current song.
   */
  protected playedTime: number;
  /**
   * The paused time of the sequencer.
   * If the sequencer is not paused, this is undefined.
   */
  protected pausedTime?: number;
  /**
   * Absolute time of the sequencer when it started playing.
   * It is based on the synth's current time.
   */
  protected absoluteStartTime: number;
  /**
   * Currently playing notes, for pressing them after pausing.
   * Map per channel, key: velocity.
   * If the `.get()` method returns nothing then this note is not playing.
   */
  protected readonly playingNotes: Map<number, number>[];
  /**
   * MIDI Port number for each of the MIDI tracks in the current sequence.
   */
  protected currentMIDIPorts: number[];
  /**
   * This is used to assign new MIDI port offsets to new ports.
   */
  protected midiPortChannelOffset: number;
  /**
   * Channel offsets for each MIDI port.
   * Stored as:
   * Record<midi port, channel offset>
   */
  protected midiPortChannelOffsets: Record<number, number>;
  protected assignMIDIPort: (trackNum: number, port: number) => void;
  protected loadNewSequence: (parsedMIDI: BasicMIDI) => void;
  protected processEvent: (event: MIDIMessage, trackIndex: number) => void;
  protected setTimeTo: typeof setTimeToInternal;
  /**
   * Initializes a new Sequencer without any songs loaded.
   * @param spessasynthProcessor the synthesizer processor to use with this sequencer.
   */
  constructor(spessasynthProcessor: SpessaSynthProcessor);
  protected _midiData?: BasicMIDI;
  /**
   * The currently loaded MIDI data.
   */
  get midiData(): BasicMIDI | undefined;
  /**
   * The length of the current sequence in seconds.
   */
  get duration(): number;
  protected _songIndex: number;
  /**
   * The current song index in the song list.
   * If shuffle mode is enabled, this is the index of the shuffled song list.
   */
  get songIndex(): number;
  /**
   * The current song index in the song list.
   * If shuffle mode is enabled, this is the index of the shuffled song list.
   */
  set songIndex(value: number);
  protected _shuffleMode: boolean;
  /**
   * Controls if the sequencer should shuffle the songs in the song list.
   * If true, the sequencer will play the songs in a random order.
   * Songs are shuffled on a `loadNewSongList` call.
   */
  get shuffleMode(): boolean;
  /**
   * Controls if the sequencer should shuffle the songs in the song list.
   * If true, the sequencer will play the songs in a random order.
   * Songs are shuffled on a `loadNewSongList` call.
   */
  set shuffleMode(on: boolean);
  /**
   * Internal playback rate.
   */
  protected _playbackRate: number;
  /**
   * The sequencer's playback rate.
   * This is the rate at which the sequencer plays back the MIDI data.
   */
  get playbackRate(): number;
  /**
   * The sequencer's playback rate.
   * This is the rate at which the sequencer plays back the MIDI data.
   * @param value the playback rate to set.
   */
  set playbackRate(value: number);
  /**
   * The current time of the sequencer.
   * This is the time in seconds since the sequencer started playing.
   */
  get currentTime(): number;
  /**
   * The current time of the sequencer.
   * This is the time in seconds since the sequencer started playing.
   * @param time the time to set in seconds.
   */
  set currentTime(time: number);
  /**
   * True if paused, false if playing or stopped
   */
  get paused(): boolean;
  /**
   * Starts or resumes the playback of the sequencer.
   * If the sequencer is paused, it will resume from the paused time.
   */
  play(): void;
  /**
   * Pauses the playback.
   */
  pause(): void;
  /**
   * Loads a new song list into the sequencer.
   * @param midiBuffers the list of songs to load.
   */
  loadNewSongList(midiBuffers: BasicMIDI[]): void;
  protected callEvent<K extends keyof SequencerEventData>(type: K, data: SequencerEventData[K]): void;
  protected pauseInternal(isFinished: boolean): void;
  protected songIsFinished(): void;
  /**
   * Stops the playback
   */
  protected stop(): void;
  /**
   * Adds a new port (16 channels) to the synth.
   */
  protected addNewMIDIPort(): void;
  protected sendMIDIMessage(message: number[]): void;
  protected sendMIDIAllOff(): void;
  protected sendMIDIReset(): void;
  protected loadCurrentSong(): void;
  protected shuffleSongIndexes(): void;
  /**
   * Sets the time in MIDI ticks.
   * @param ticks the MIDI ticks to set the time to.
   */
  protected setTimeTicks(ticks: number): void;
  /**
   * Recalculates the absolute start time of the sequencer.
   * @param time the time in seconds to recalculate the start time for.
   */
  protected recalculateStartTime(time: number): void;
  /**
   * Jumps to a MIDI tick without any further processing.
   * @param targetTicks The MIDI tick to jump to.
   * @protected
   */
  protected jumpToTick(targetTicks: number): void;
  protected sendMIDINoteOn(channel: number, midiNote: number, velocity: number): void;
  protected sendMIDINoteOff(channel: number, midiNote: number): void;
  protected sendMIDICC(channel: number, type: MIDIController, value: number): void;
  protected sendMIDISysEx(syx: SysExAcceptedArray): void;
  /**
   * Sets the pitch of the given channel
   * @param channel usually 0-15: the channel to change pitch
   * @param pitch the 14-bit pitch value
   */
  protected sendMIDIPitchWheel(channel: number, pitch: number): void;
}
//#endregion
export { BasicInstrument, BasicInstrumentZone, BasicMIDI, BasicPreset, BasicPresetZone, BasicSample, BasicSoundBank, BasicZone, CONTROLLER_TABLE_SIZE, CachedVoiceList, type ChannelMIDIParameter, ChannelMIDIParameterChange, type ChannelSystemParameter, ChorusProcessor, ChorusProcessorSnapshot, ControllerChangeCallback, DEFAULT_CHANNEL_MIDI_PARAMETERS, DEFAULT_CHANNEL_SYSTEM_PARAMETERS, DEFAULT_DRUM_REVERB, DEFAULT_GLOBAL_MIDI_PARAMETERS, DEFAULT_GLOBAL_SYSTEM_PARAMETERS, DEFAULT_MIDI_CONTROLLERS, DEFAULT_PERCUSSION, DEFAULT_SYNTH_MODE, DLSChunkFourCC, DLSInfoFourCC, DLSLoop, DLSWriteOptions, DelayProcessor, DelayProcessorSnapshot, EffectChangeCallback, EmptySample, type FourCC, GENERATORS_AMOUNT, Generator, GeneratorLimits, GeneratorType, GeneratorTypes, GenericBankInfoFourCC, type GenericRIFFFourCC, GenericRange, type GlobalMIDIParameter, GlobalMIDIParameterChangeCallback, type GlobalSystemParameter, IndexedByteArray, InsertionProcessor, InsertionProcessorConstructor, InsertionProcessorSnapshot, InterpolationType, InterpolationTypes, KeyModifier, MAX_GENERATOR, MIDIBuilder, MIDIChannel, MIDIController, MIDIControllers, MIDIFormat, MIDILoop, MIDILoopType, MIDIMessage, MIDIMessageType, MIDIMessageTypes, MIDIPatch, MIDIPatchFull, MIDIPatchTools, MIDISystem, MIDITrack, MIDIUtils, type ModifyMIDIOptions, Modulator, ModulatorControllerSource, ModulatorControllerSources, ModulatorCurveType, ModulatorCurveTypes, ModulatorSource, ModulatorSourceIndex, ModulatorTransformType, ModulatorTransformTypes, NonRegisteredLSB, NonRegisteredMSB, NoteOffCallback, NoteOnCallback, NoteTime, PolyPressureCallback, PresetsWithKeyCombinations, ProgramChangeCallback, ProgressFunction, RMIDIWriteOptions, RMIDInfoData, RMIDInfoFourCC, RegisteredParameterTypes, ReverbProcessor, ReverbProcessorSnapshot, SF2Channel, SF2ChunkFourCC, SF2InfoFourCC, SF2VersionTag, SFEWriteOptions, SPESSASYNTH_GAIN_FACTOR, SPESSA_BUFSIZE, SampleEncodingFunction, SampleLoopingMode, SampleType, SampleTypes, SequencerEvent, SequencerEventData, SetSampleFormatOptions, SoundBankInfoData, SoundBankInfoFourCC, SoundBankLoader, SoundBankManagerListEntry, SoundFont2WriteOptions, SpessaLog, SpessaSynthCoreUtils, SpessaSynthProcessor, SpessaSynthSequencer, StopAllCallback, SynthMethodOptions, SynthProcessorEvent, SynthProcessorEventData, SynthProcessorOptions, type SynthesizerSnapshot, SysExAcceptedArray, TempoChange, TimelineEvent, VOICE_CAP, VoiceParameters, WaveMetadata, WaveWriteOptions, audioToWav };
//# sourceMappingURL=index.d.ts.map