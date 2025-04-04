import type { NextConfig } from "next";
import withFlowbiteReact from "flowbite-react/plugin/nextjs";

const nextConfig: NextConfig = {
  /* config options here */
  images:{
    domains:[
      'avatars.githubusercontent.com',
      '8xbvhgbxqz.ufs.sh',
    ]
  }
};

export default withFlowbiteReact(nextConfig);