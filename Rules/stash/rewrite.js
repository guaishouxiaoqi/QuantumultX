/**
 * 常用规则合集 - 动态适配版
 * 逻辑：自动识别订阅中的代理组名称，并应用 Copilot & Apple Intelligence 规则
 */
export default function ({ profileName }) {
  /**
   * profileName = 当前启用的订阅名称
   * 请确保订阅名称中能区分来源
   */

  let proxyName = "节点选择"; // 默认兜底策略组

  // 👉 根据订阅名映射策略组
  if (profileName.includes("泡泡")) {
    proxyName = "泡泡Dog";
  } else if (profileName.includes("良心云")) {
    proxyName = "良心云";
  } else if (profileName.includes("节点")) {
    proxyName = "节点选择";
  }

  return {
    rules: [
      // ========= 直连 =========
      "DOMAIN-SUFFIX,js.design,DIRECT",
      "DOMAIN-KEYWORD,jsdesign,DIRECT",

      // ========= 必须走代理 =========
      `DOMAIN-SUFFIX,copilot.microsoft.com,${proxyName}`,
      `DOMAIN-SUFFIX,edgeservices.bing.com,${proxyName}`,
      `DOMAIN-SUFFIX,bing.com,${proxyName}`,

      `DOMAIN-SUFFIX,smoot.apple.com,${proxyName}`,
      `DOMAIN-SUFFIX,gspe1-ssl.ls.apple.com,${proxyName}`,
      `DOMAIN-SUFFIX,cp4.cloudflare.com,${proxyName}`,

      `DOMAIN-SUFFIX,quzzoni.apple.com,${proxyName}`,
      `DOMAIN-SUFFIX,guzzoni.apple.com,${proxyName}`,

      `DOMAIN-SUFFIX,apple-relay.cloudflare.com,${proxyName}`,
      `DOMAIN-SUFFIX,apple-relay.fastly-edge.com,${proxyName}`,
      `DOMAIN-SUFFIX,apple-relay.apple.com,${proxyName}`,
      `DOMAIN-SUFFIX,apple-relay.mask.apple-dns.net,${proxyName}`,

      `DOMAIN-SUFFIX,gateway.icloud.com,${proxyName}`,

      // ========= 兜底（非常重要） =========
      `MATCH,${proxyName}`,
    ],
  };
}
