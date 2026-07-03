import type { NextConfig } from "next";

import { worldalityStudio } from "worldality/studio";

const nextConfig: NextConfig = {};

export default worldalityStudio().next(nextConfig);

