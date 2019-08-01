const HdrLowBitRate = {
  "1440p": 20000000,
  "1080p": 10000000,
  "720p": 6500000
};

const HdrHighBitRate = {
  "1440p": 30000000,
  "1080p": 15000000,
  "720p": 9500000
};

const SdrLowBitRate = {
  "1440p": 16000000,
  "1080p": 8000000,
  "720p": 5000000,
  "480p": 2500000,
  "360p": 1000000
};

const SdrHighBitRate = {
  "1440p": 24000000,
  "1080p": 12000000,
  "720p": 7500000,
  "480p": 4000000,
  "360p": 1500000
};

export default function getBitRate(framerate, quality, resolution) {
  console.log(framerate);
  if (quality === "HDR") {
    if ([24, 25, 30].includes(framerate)) {
      return HdrLowBitRate[resolution];
    } else {
      return HdrHighBitRate[resolution];
    }
  } else {
    if ([24, 25, 30].includes(framerate)) {
      return SdrLowBitRate[resolution];
    } else {
      return SdrHighBitRate[resolution];
    }
  }
}
