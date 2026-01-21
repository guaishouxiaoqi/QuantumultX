/**
 * 常用规则合集 - 动态适配版
 * 逻辑：自动识别订阅中的代理组名称，并应用 Copilot & Apple Intelligence 规则
 */

if ($type === "config") {
  let config = JSON.parse($files[0]);

  // --- 1. 自动寻找代理策略组 ---
  const groupRegex = /(泡泡Dog|PROXY|节点选择|手动选择|良心云|Proxy|Traffic)/i;
  let targetGroup = config["proxy-groups"].find(g => groupRegex.test(g.name));
  const proxyName = targetGroup ? targetGroup.name : (config["proxy-groups"][0] ? config["proxy-groups"][0].name : "DIRECT");

  // --- 2. 清理干扰规则 ---
  // 如果主配置里已经有了关于 js.design 的规则，先删掉它，防止重复或冲突
  if (config.rules) {
    config.rules = config.rules.filter(r => !r.includes("js.design") && !r.includes("jsdesign"));
  } else {
    config.rules = [];
  }

  // --- 3. 定义规则阵列 ---
  // 将 DIRECT 规则放在最前面，且确保 MATCH 放在最后
  const directRules = [
    "DOMAIN-SUFFIX,js.design,DIRECT",
    "DOMAIN-KEYWORD,jsdesign,DIRECT"
  ];

  const proxyRules = [
    `DOMAIN-SUFFIX,copilot.microsoft.com,${proxyName}`,
    `DOMAIN-SUFFIX,edgeservices.bing.com,${proxyName}`,
    `DOMAIN-SUFFIX,bing.com,${proxyName}`,
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

  // --- 4. 重新组合规则 ---
  // 顺序：直连规则 > 代理规则 > 原配置规则
  config.rules = [...directRules, ...proxyRules, ...config.rules];

  // 强制处理 MATCH 规则（如果有重复的 MATCH，保留我们定义的代理组 MATCH）
  config.rules = config.rules.filter(r => !r.startsWith("MATCH,"));
  config.rules.push(`MATCH,${proxyName}`);

  $done(config);
} else {
  $done({});
}