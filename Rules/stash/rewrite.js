/**
 * 常用规则合集 - 动态适配版
 * 逻辑：自动识别订阅中的代理组名称，并应用 Copilot & Apple Intelligence 规则
 */

if ($type === "config") {
  let config = JSON.parse($files[0]);

  // --- 1. 自动寻找代理策略组名称 ---
  // 按照优先级寻找：泡泡Dog > PROXY > 节点选择 > 手动选择 > 第一个策略组
  const groupRegex = /(泡泡Dog|PROXY|节点选择|手动选择|良心云|Proxy|Traffic)/i;
  let targetGroup = config["proxy-groups"].find(g => groupRegex.test(g.name));

  // 兜底方案：如果都没找到，取第一个组名
  const proxyName = targetGroup ? targetGroup.name : config["proxy-groups"][0].name;

  // --- 2. 定义你的规则模板 ---
  // 这里将原来的 "节点选择" 替换为动态获取的 ${proxyName}
  const myCustomRules = [
    // js.design 直连
    "DOMAIN-SUFFIX,js.design,DIRECT",
    "DOMAIN-KEYWORD,jsdesign,DIRECT",

    // Copilot
    `DOMAIN-SUFFIX,copilot.microsoft.com,${proxyName}`,
    `DOMAIN-SUFFIX,edgeservices.bing.com,${proxyName}`,
    `DOMAIN-SUFFIX,bing.com,${proxyName}`,

    // Apple Intelligence
    `DOMAIN-SUFFIX,smoot.apple.com,${proxyName}`,
    `DOMAIN-SUFFIX,gspe1-ssl.ls.apple.com,${proxyName}`,
    `DOMAIN-SUFFIX,cp4.cloudflare.com,${proxyName}`,
    `DOMAIN-SUFFIX,quzzoni.apple.com,${proxyName}`,
    `DOMAIN-SUFFIX,apple-relay.cloudflare.com,${proxyName}`,
    `DOMAIN-SUFFIX,apple-relay.fastly-edge.com,${proxyName}`,
    `DOMAIN-SUFFIX,apple-relay.apple.com,${proxyName}`,
    `DOMAIN-SUFFIX,guzzoni.apple.com,${proxyName}`,
    `DOMAIN-SUFFIX,apple-relay.mask.apple-dns.net,${proxyName}`,
    `DOMAIN-SUFFIX,gateway.icloud.com,${proxyName}`
  ];

  // --- 3. 插入规则 ---
  // 将自定义规则插入到所有规则的最前面
  if (!config.rules) config.rules = [];
  config.rules = [...myCustomRules, ...config.rules];

  $done(config);
} else {
  $done({});
}