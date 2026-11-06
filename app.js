/* 宝谱 BAOPU — 纯静态标本盘
 * 无框架、无构建、无外部依赖。数据由 data/*.js 挂在 window 上。
 */
(function () {
  'use strict';

  /* ------------------------------- 常量 ------------------------------- */

  var GEMS = window.GEMS || [];
  var METALS = window.METALS || [];

  var PAGE_SIZE = 15;

  var HUES = [
    { id: 'clear', name: '无色', hex: '#EFEAE0' },
    { id: 'gold', name: '金', hex: '#C9A227' },
    { id: 'yellow', name: '黄', hex: '#D9B44A' },
    { id: 'orange', name: '橙', hex: '#C46A2E' },
    { id: 'red', name: '红', hex: '#9E1B32' },
    { id: 'pink', name: '粉', hex: '#D98CA0' },
    { id: 'purple', name: '紫', hex: '#6B3FA0' },
    { id: 'blue', name: '蓝', hex: '#2F5D94' },
    { id: 'cyan', name: '青', hex: '#3FA8A0' },
    { id: 'green', name: '绿', hex: '#2E7D5B' },
    { id: 'black', name: '黑', hex: '#211C17' },
    { id: 'brown', name: '棕', hex: '#7A5230' }
  ];

  var HUE_MAP = {};
  HUES.forEach(function (h) { HUE_MAP[h.id] = h; });

  var PRICE = {
    1: { label: '平价', sym: '¥' },
    2: { label: '中档', sym: '¥¥' },
    3: { label: '高档', sym: '¥¥¥' },
    4: { label: '极高档', sym: '¥¥¥¥' }
  };

  var MARKETS = ['天然', '热处理', '充填', '染色', '合成', '仿制'];

  var JEWELRY = [
    { id: 'ring', name: '戒指' },
    { id: 'pendant', name: '吊坠' },
    { id: 'earring', name: '耳饰' },
    { id: 'bracelet', name: '手链' },
    { id: 'brooch', name: '胸针' },
    { id: 'display', name: '摆件' }
  ];

  var CUT_LABEL = {
    round: '圆钻',
    oval: '椭圆',
    emerald: '祖母绿切',
    pear: '水滴',
    marquise: '马眼',
    cabochon: '弧面',
    raw: '原石',
    ingot: '铸锭',
    sphere: '圆珠',
    dzi: '天珠',
    meteorite: '维斯台登切片',
    pallasite: '橄榄陨石切片'
  };


  var CUT_GROUPS = [
    { n: 1, title: '经典切工', en: 'CLASSIC', color: '#A9BED2', desc: '从基础外形到经典切工，先建立宝石切割的核心认知。' },
    { n: 2, title: '花式与弧面', en: 'FANCY & CABOCHON', color: '#D8A8B2', desc: '从复古老式切工到弧面与花式切割，丰富对宝石切工的认识。' },
    { n: 3, title: '创意与花式', en: 'CREATIVE', color: '#B9A8D8', desc: '从创意轮廓到设计师花式切工，进一步认识宝石造型的多样表达。' },
    { n: 4, title: '配石与特殊造型', en: 'MELEE & SPECIAL', color: '#A8C4AE', desc: '配石、雕刻、随形与特殊结构切工，补全切割认知。' }
  ];

  var CUTS = [
    ['round', '圆形明亮式', 'Round Brilliant', 'circle', 'brilliant', 1],
    ['princess', '公主方', 'Princess', 'square', 'brilliant', 1],
    ['oval', '椭圆形', 'Oval', 'oval', 'brilliant', 1],
    ['pear', '梨形', 'Pear', 'pear', 'brilliant', 1],
    ['heart', '心形', 'Heart', 'heart', 'brilliant', 1],
    ['marquise', '马眼形', 'Marquise', 'marquise', 'brilliant', 1],
    ['radiant', '雷迪恩', 'Radiant', 'radiant', 'brilliant', 1],
    ['cushion', '垫形明亮式', 'Cushion', 'cushion', 'brilliant', 1],
    ['trillion', '三角明亮式', 'Trillion', 'trillion', 'brilliant', 1],
    ['pentagon', '五边形', 'Pentagon', 'pentagon', 'brilliant', 1],
    ['hexagon', '六边形', 'Hexagon', 'hexagon', 'brilliant', 1],
    ['octagon', '八边形', 'Octagon', 'octagon', 'brilliant', 1],
    ['kite', '风筝形', 'Kite', 'kite', 'brilliant', 1],
    ['bullet', '子弹形', 'Bullet', 'bullet', 'brilliant', 1],
    ['halfmoon', '半月形', 'Half Moon', 'halfmoon', 'brilliant', 1],
    ['trapezoid', '梯形明亮式', 'Trapeze', 'trapezoid', 'brilliant', 1],
    ['emerald', '祖母绿切割', 'Emerald', 'emerald', 'step', 1],
    ['asscher', '阿斯切方形', 'Asscher', 'squareOct', 'step', 1],
    ['baguette', '长方阶梯', 'Baguette', 'rect', 'step', 1],
    ['tapered', '锥形长方', 'Tapered Baguette', 'trapezoid', 'step', 1],
    ['squareStep', '梯方形', 'Square Step', 'square', 'step', 1],
    ['french', '法式长方', 'French Cut', 'rect', 'stepDense', 1],
    ['octaStep', '八角阶梯', 'Octagon Step', 'octagon', 'step', 1],
    ['organ', '风琴阶梯', 'Organ Step', 'rect', 'stepDense', 1],
    ['oldEuropean', '老欧洲式', 'Old European', 'circle', 'oldEuro', 1],

    ['oldMine', '老矿工式', 'Old Mine', 'cushion', 'oldMine', 2],
    ['rose', '玫瑰式', 'Rose Cut', 'circle', 'rose', 2],
    ['single', '单翻式', 'Single Cut', 'circle', 'single', 2],
    ['dutchRose', '荷兰玫瑰', 'Dutch Rose', 'circle', 'rose2', 2],
    ['antwerpRose', '安特卫普玫瑰', 'Antwerp Rose', 'circle', 'rose3', 2],
    ['portuguese', '葡萄牙式', 'Portuguese', 'circle', 'portuguese', 2],
    ['flemish', '法兰德斯式', 'Flemish', 'circle', 'portuguese', 2],
    ['table', '桌形切割', 'Table Cut', 'square', 'single', 2],
    ['cabochon', '弧面蛋面', 'Cabochon', 'oval', 'cab', 2],
    ['doubleCab', '双凸弧面', 'Double Cabochon', 'oval', 'cabDouble', 2],
    ['highCab', '高凸弧面', 'High Dome', 'circle', 'cabHigh', 2],
    ['hollowCab', '空心弧面', 'Hollow Cabochon', 'oval', 'hollow', 2],
    ['concaveCab', '凹弧面', 'Concave Cabochon', 'oval', 'concave', 2],
    ['bulletCab', '子弹弧面', 'Bullet Cabochon', 'bullet', 'cab', 2],
    ['sugarLoaf', '糖塔形', 'Sugar Loaf', 'sugar', 'step', 2],
    ['ovalCab', '椭圆弧面', 'Oval Cabochon', 'oval', 'cab', 2],
    ['roundCab', '圆弧面', 'Round Cabochon', 'circle', 'cab', 2],
    ['checker', '棋盘格切割', 'Checkerboard', 'cushion', 'checker', 2],
    ['concave', '凹刻面', 'Concave Cut', 'circle', 'concave', 2],
    ['king', '王者切割', 'King Cut', 'circle', 'brilliant', 2],
    ['emperor', '帝王切割', 'Emperor Cut', 'emerald', 'step', 2],
    ['barion', '巴里艾切割', 'Barion Cut', 'pear', 'barion', 2],
    ['sunflower', '太阳花切割', 'Sunflower Cut', 'circle', 'flower', 2],
    ['snowflake', '雪花切割', 'Snowflake Cut', 'circle', 'snow', 2],
    ['star', '星形切割', 'Star Cut', 'star6', 'star', 2],

    ['flower', '花朵切割', 'Flower Cut', 'circle', 'flower', 3],
    ['swirl', '旋转切割', 'Swirl Cut', 'circle', 'swirl', 3],
    ['puzzle', '拼图切割', 'Puzzle Cut', 'square', 'checker', 3],
    ['baroque', '巴洛克旋形', 'Baroque', 'freeform', 'swirl', 3],
    ['arrows', '八心八箭', 'Hearts & Arrows', 'circle', 'arrows', 3],
    ['royalAsscher', '皇家阿斯切', 'Royal Asscher', 'squareOct', 'stepDense', 3],
    ['tiffanyTrue', '蒂芙尼真爱', 'Tiffany True', 'cushion', 'brilliant', 3],
    ['mondrian', '蒙德里安切割', 'Mondrian', 'square', 'grid', 3],
    ['dragonHeart', '龙之心切割', 'Dragon Heart', 'heart', 'brilliant', 3],
    ['lily', '莉莉切割', 'Lily Cut', 'heart', 'flower', 3],
    ['chevron', '雪佛龙切割', 'Chevron', 'hexagon', 'step', 3],
    ['phoenix', '凤凰切割', 'Phoenix', 'circle', 'swirl', 3],
    ['seal', '玉玺切割', 'Seal Cut', 'octagon', 'step', 3],
    ['eightHeart', '八心切割', 'Eight Hearts', 'circle', 'flower', 3],
    ['joy', '喜悦切割', 'Joy Cut', 'circle', 'brilliant', 3],
    ['christmas', '圣诞星切割', 'Christmas Star', 'star6', 'star', 3],
    ['longOval', '长椭圆', 'Long Oval', 'ovalLong', 'brilliant', 3],
    ['longCushion', '长垫形', 'Long Cushion', 'cushionLong', 'brilliant', 3],
    ['longHex', '长六边形', 'Long Hexagon', 'hexLong', 'step', 3],
    ['coffin', '棺材形', 'Coffin', 'coffin', 'step', 3],
    ['shield', '盾形', 'Shield', 'shield', 'brilliant', 3],
    ['star5', '五角星形', 'Five-point Star', 'star5', 'star', 3],
    ['crescent', '新月形', 'Crescent', 'moon', 'none', 3],
    ['fan', '扇形', 'Fan', 'fan', 'step', 3],
    ['lock', '锁形', 'Lock', 'lock', 'step', 3],

    ['rectCut', '长方切角', 'Rectangular Cut', 'rect', 'step', 4],
    ['squareCut', '方形切角', 'Square Cut', 'squareOct', 'step', 4],
    ['roundTri', '圆角三角', 'Rounded Triangle', 'trillion', 'step', 4],
    ['freeform', '不对称随形', 'Freeform', 'freeform', 'brilliant', 4],
    ['intaglio', '凹雕', 'Intaglio', 'oval', 'profile', 4],
    ['cameo', '浮雕', 'Cameo', 'oval', 'profile', 4],
    ['carved', '雕花宝石', 'Carved Gem', 'freeform', 'flower', 4],
    ['sphere', '球形', 'Sphere', 'circle', 'none', 4],
    ['tumbled', '滚磨形', 'Tumbled', 'freeform', 'none', 4],
    ['roughSet', '原石镶嵌', 'Rough-set', 'crystal', 'none', 4],
    ['crystal', '晶体原型', 'Crystal Point', 'crystal', 'crystal', 4],
    ['cone', '锥形单翻', 'Cone Single', 'bullet', 'single', 4],
    ['octaMelee', '八角配石', 'Octagon Melee', 'octagon', 'step', 4],
    ['roundMelee', '圆形小钻', 'Round Melee', 'circle', 'single', 4],
    ['princessMelee', '公主方小钻', 'Princess Melee', 'square', 'single', 4],
    ['baguetteMelee', '长方阶梯配石', 'Baguette Melee', 'rect', 'step', 4],
    ['taperedMelee', '梯形配石', 'Tapered Melee', 'trapezoid', 'step', 4],
    ['bulletMelee', '子弹配石', 'Bullet Melee', 'bullet', 'step', 4],
    ['halfMelee', '半月配石', 'Half Moon Melee', 'halfmoon', 'step', 4],
    ['modifiedCushion', '改良垫形', 'Modified Cushion', 'cushion', 'brilliant', 4],
    ['antiqueCushion', '古典枕形', 'Antique Cushion', 'cushion', 'oldMine', 4],
    ['octaEmerald', '八角祖母绿', 'Octagon Emerald', 'emerald', 'step', 4],
    ['doubleStep', '双层阶梯', 'Double Step', 'squareOct', 'stepDense', 4],
    ['barionCushion', '巴里艾垫形', 'Barion Cushion', 'cushion', 'barion', 4],
    ['mixed', '混合切割', 'Mixed Cut', 'oval', 'brilliant', 4]
  ].map(function (a) {
    return { id: a[0], cn: a[1], en: a[2], shape: a[3], pattern: a[4], g: a[5] };
  });

  var CUT_MAP = {};
  CUTS.forEach(function (c) {
    CUT_MAP[c.id] = c;
    if (!CUT_LABEL[c.id]) CUT_LABEL[c.id] = c.cn;
  });

  var LEGACY_CUT = { round: 1, oval: 1, emerald: 1, pear: 1, marquise: 1, cabochon: 1, sphere: 1, raw: 1, ingot: 1 };
  var artSeq = 0;

  function polyE(n, rx, ry, rot) {
    var pts = [];
    for (var i = 0; i < n; i++) {
      var a = (rot || 0) + i * 2 * Math.PI / n;
      pts.push([(50 + rx * Math.cos(a)).toFixed(1), (50 + ry * Math.sin(a)).toFixed(1)]);
    }
    return 'M' + pts.map(function (p) { return p[0] + ' ' + p[1]; }).join('L') + 'Z';
  }

  function starPath(n, r1, r2, rot) {
    var pts = [];
    for (var i = 0; i < n * 2; i++) {
      var a = (rot || 0) + i * Math.PI / n;
      var r = i % 2 ? r2 : r1;
      pts.push([(50 + r * Math.cos(a)).toFixed(1), (50 + r * Math.sin(a)).toFixed(1)]);
    }
    return 'M' + pts.map(function (p) { return p[0] + ' ' + p[1]; }).join('L') + 'Z';
  }

  function shapePath(name) {
    switch (name) {
      case 'circle': return 'M50 6a44 44 0 1 0 .01 0z';
      case 'oval': return 'M50 4a28 46 0 1 0 .01 0z';
      case 'ovalLong': return 'M50 2a21 48 0 1 0 .01 0z';
      case 'cushion': return 'M28 10h44q16 0 16 16v48q0 16-16 16H28q-16 0-16-16V26q0-16 16-16z';
      case 'cushionLong': return 'M34 6h32q14 0 14 14v60q0 14-14 14H34q-14 0-14-14V20q0-14 14-14z';
      case 'square': return 'M16 16h68v68H16z';
      case 'rect': return 'M32 6h36v88H32z';
      case 'emerald': return 'M34 10h32l24 24v32L66 90H34L10 66V34z';
      case 'squareOct': return 'M32 12h36l20 20v36L68 88H32L12 68V32z';
      case 'radiant': return 'M30 12h40l18 18v40L70 88H30L12 70V30z';
      case 'pear': return 'M50 6C58 18 84 38 84 62C84 82 69 94 50 94C31 94 16 82 16 62C16 38 42 18 50 6Z';
      case 'marquise': return 'M50 5C70 25 84 42 84 50C84 58 70 75 50 95C30 75 16 58 16 50C16 42 30 25 50 5Z';
      case 'heart': return 'M50 88C20 66 10 48 10 34C10 20 21 12 33 12C42 12 48 17 50 24C52 17 58 12 67 12C79 12 90 20 90 34C90 48 80 66 50 88Z';
      case 'trillion': return 'M50 8L90 80q4 8-4 8H14q-8 0-4-8z';
      case 'pentagon': return polyE(5, 44, 44, -Math.PI / 2);
      case 'hexagon': return polyE(6, 44, 44, 0);
      case 'hexLong': return polyE(6, 26, 46, 0);
      case 'octagon': return polyE(8, 44, 44, Math.PI / 8);
      case 'kite': return 'M50 4L86 46 50 96 14 46z';
      case 'bullet': return 'M28 92V44C28 22 38 8 50 8s22 14 22 36v48z';
      case 'halfmoon': return 'M8 50a42 42 0 0 1 84 0z';
      case 'trapezoid': return 'M26 12h48l14 76H12z';
      case 'sugar': return 'M50 4c18 24 30 52 34 88H16C20 56 32 28 50 4z';
      case 'shield': return 'M50 4L88 20v36c0 22-18 34-38 40-20-6-38-18-38-40V20z';
      case 'star5': return starPath(5, 46, 20, -Math.PI / 2);
      case 'star6': return starPath(6, 46, 22, -Math.PI / 2);
      case 'moon': return 'M62 4a46 46 0 1 0 0 92 36 46 0 0 1 0-92z';
      case 'fan': return 'M50 94L10 70a46 46 0 0 1 80 0z';
      case 'lock': return 'M28 42V32a22 22 0 0 1 44 0v10h14v52H14V42z';
      case 'coffin': return 'M34 6h32l22 44-22 44H34L12 50z';
      case 'freeform': return 'M50 6c18 2 34 16 36 34 2 20-10 40-30 46-18 5-38-6-44-24C6 44 18 22 34 12c5-3 10-6 16-6z';
      case 'crystal': return 'M50 4L68 26v66H32V26z';
      default: return 'M50 6a44 44 0 1 0 .01 0z';
    }
  }

  function rad(n, r1, r2, rot) {
    var out = '';
    for (var i = 0; i < n; i++) {
      var a = (rot || -Math.PI / 2) + i * 2 * Math.PI / n;
      out += '<path d="M' + (50 + r1 * Math.cos(a)).toFixed(1) + ' ' + (50 + r1 * Math.sin(a)).toFixed(1) +
        'L' + (50 + r2 * Math.cos(a)).toFixed(1) + ' ' + (50 + r2 * Math.sin(a)).toFixed(1) + '"/>';
    }
    return out;
  }

  function gridLines(n) {
    var out = '', step = 100 / (n + 1), i;
    for (i = 1; i <= n; i++) {
      out += '<path d="M0 ' + (step * i).toFixed(1) + 'H100"/>';
      out += '<path d="M' + (step * i).toFixed(1) + ' 0V100"/>';
    }
    return out;
  }

  function petals(n, pr, dist) {
    var out = '';
    for (var i = 0; i < n; i++) {
      var a = i * 2 * Math.PI / n - Math.PI / 2;
      out += '<circle cx="' + (50 + dist * Math.cos(a)).toFixed(1) + '" cy="' + (50 + dist * Math.sin(a)).toFixed(1) + '" r="' + pr + '"/>';
    }
    return out;
  }

  function patternSVG(name, d) {
    function s(k) {
      return '<path d="' + d + '" transform="translate(50 50) scale(' + k + ') translate(-50 -50)"/>';
    }
    switch (name) {
      case 'brilliant': return s(0.55) + rad(12, 24, 58);
      case 'oldEuro': return s(0.42) + rad(8, 20, 58) + rad(8, 8, 20);
      case 'oldMine': return s(0.66) + rad(8, 28, 58);
      case 'step': return s(0.8) + s(0.62) + s(0.44) + s(0.26);
      case 'stepDense': return s(0.88) + s(0.72) + s(0.56) + s(0.4) + s(0.24);
      case 'rose': return s(0.5) + rad(12, 3, 58);
      case 'rose2': return s(0.62) + rad(10, 4, 58);
      case 'rose3': return s(0.4) + rad(16, 3, 58);
      case 'single': return s(0.5) + rad(8, 18, 55);
      case 'portuguese': return s(0.38) + rad(18, 10, 58);
      case 'cab': return '<ellipse cx="50" cy="45" rx="23" ry="15"/><path d="M27 45c2-9 10-16 21-18"/>';
      case 'cabDouble': return '<ellipse cx="50" cy="46" rx="25" ry="17"/><path d="M25 42c3-8 11-14 22-16"/><path d="M29 64c6 5 13 7 21 7"/>';
      case 'cabHigh': return '<circle cx="50" cy="48" r="25"/><path d="M29 40c5-10 13-15 25-16"/>';
      case 'hollow': return s(0.82) + s(0.68);
      case 'concave': return rad(8, 54, 16) + rad(8, 16, 54, 0.39);
      case 'checker': return gridLines(3);
      case 'grid': return gridLines(4);
      case 'flower': return petals(8, 12, 19) + '<circle cx="50" cy="50" r="7"/>';
      case 'snow': return rad(6, 4, 58) + rad(6, 26, 36, 0.26);
      case 'swirl': return '<path d="M50 50c8-10 20-6 22 4s-8 18-18 14"/><path d="M50 50c-8-10-20-6-22 4s8 18 18 14"/>' + rad(4, 10, 54, 0.6);
      case 'arrows': return rad(8, 16, 56) + rad(8, 40, 48, 0.79);
      case 'star': return s(0.45) + rad(8, 10, 58) + rad(8, 28, 58);
      case 'barion': return s(0.6) + rad(8, 26, 58) + '<path d="M32 74h36"/>';
      case 'crystal': return '<path d="M50 8v80M34 28 50 38 66 28"/>';
      case 'profile': return '<circle cx="50" cy="40" r="12"/><path d="M28 84c2-14 10-21 22-21s20 7 22 21"/>';
      default: return '';
    }
  }

  function cutSVG(def, color, opts) {
    opts = opts || {};
    var solid = opts.mode === 'solid';
    var edge = solid ? '#C9A25F' : '#A67C3D';
    var facet = solid ? 'rgba(247,242,233,.5)' : 'rgba(166,124,61,.7)';
    var d = shapePath(def.shape);
    var id = 'cutclip' + (++artSeq);
    var inner = patternSVG(def.pattern, d);
    return '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">' +
      '<defs><clipPath id="' + id + '"><path d="' + d + '"/></clipPath></defs>' +
      '<path d="' + d + '" fill="' + color + '" fill-opacity="' + (solid ? 1 : 0.18) + '" stroke="' + edge + '" stroke-width="1.35" stroke-linejoin="round"/>' +
      '<g clip-path="url(#' + id + ')" fill="none" stroke="' + facet + '" stroke-width=".9" stroke-linejoin="round">' + inner + '</g>' +
      '</svg>';
  }



  var SETTINGS = [
    { id: 'prong', cn: '爪镶', en: 'Prong', desc: '金属爪从侧面扣住石头腰围，通常 3–6 爪。', note: '最经典、进光多；爪易勾挂，要定期检查。' },
    { id: 'bezel', cn: '包镶', en: 'Bezel', desc: '金属边整圈包住石头腰围。', note: '最稳固，适合弧面与脆石；遮挡部分光。' },
    { id: 'tension', cn: '夹镶', en: 'Tension', desc: '靠金属张力从两侧夹住石头。', note: '视觉悬浮；对石头与工艺要求高。' },
    { id: 'channel', cn: '槽镶 / 轨道镶', en: 'Channel', desc: '石头嵌在两条金属轨道之间，表面平齐。', note: '适合小钻排镶；改圈难。' },
    { id: 'bar', cn: '柱镶', en: 'Bar', desc: '每颗石头之间用金属柱隔开。', note: '经典排镶，比槽镶更透气。' },
    { id: 'peg', cn: '插镶', en: 'Peg', desc: '金属针插入珍珠或半球上的孔。', note: '珍珠耳饰常见；受力集中。' },
    { id: 'invisible', cn: '无边镶', en: 'Invisible', desc: '石头底部开槽，金属从侧面卡住，正面看不到金属。', note: '工艺难、怕撞、难维修。' },
    { id: 'fishtail', cn: '鱼尾镶', en: 'Fishtail', desc: '金属边做成鱼尾形包住石头两侧。', note: '复古；遮挡中等。' },
    { id: 'gypsy', cn: '埋镶 / 闷镶', en: 'Gypsy', desc: '石头沉入金属，顶面与金属齐平。', note: '耐磨，男戒常见；进光少。' },
    { id: 'tiger', cn: '虎爪镶', en: 'Tiger Claw', desc: '爪头分叉成两齿，像虎爪。', note: '抓得更牢，复古感强。' },
    { id: 'spade', cn: '铲边镶', en: 'Spade', desc: '用铲刀把金属推起，压住石头边缘。', note: '小钻常见；依赖工匠手感。' },
    { id: 'pave', cn: '密钉镶', en: 'Pavé', desc: '许多小钻紧挨，用细小金属钉固定。', note: '极闪；怕勾、怕掉石。' },
    { id: 'wax', cn: '蜡镶', en: 'Wax', desc: '在蜡模上排好石头再铸造，石头被金属包住。', note: '量产工艺，不是成品结构。' },
    { id: 'fancy', cn: '花式镶', en: 'Fancy', desc: '金属先做花纹或造型，再镶石。', note: '设计感强；工费高。' },
    { id: 'wrap', cn: '绕镶', en: 'Wrap', desc: '金属丝缠绕石头，手工固定。', note: '手工感强；适合异形石。' },
    { id: 'snow', cn: '雪花镶', en: 'Snowflake', desc: '多颗小钻围成雪花，主石在中心。', note: '视觉放大；结构复杂。' }
  ];

  var HABITS = [
    { id: 'massive', cn: '块状', en: 'Massive', desc: '没有明显晶形，整块产出；多数玉石与雕刻料都是这种。', eg: '翡翠、绿松石、青金石' },
    { id: 'acicular', cn: '针状', en: 'Acicular', desc: '细长如针的晶体，常成束或放射状。', eg: '霓石、钠沸石' },
    { id: 'bladed', cn: '叶片状', en: 'Bladed', desc: '扁平的板片，比针状厚；像一叠刀片。', eg: '蓝晶石、榍石' },
    { id: 'dendritic', cn: '树突状', en: 'Dendritic', desc: '在裂隙面上长成蕨叶或霜花一样的分枝，多见于锰氧化物。', eg: '氧化锰「锰树」' },
    { id: 'botryoidal', cn: '葡萄状', en: 'Botryoidal', desc: '许多半球状小晶簇聚在一起，像一串葡萄。', eg: '孔雀石、葡萄石' },
    { id: 'druzy', cn: '晶簇状', en: 'Druzy', desc: '许多小晶体密集长在同一个基底上。', eg: '紫水晶晶洞、萤石' },
    { id: 'radiating', cn: '放射状', en: 'Radiating', desc: '晶体从一点向外呈放射状排列。', eg: '碧玺、蓝晶石' },
    { id: 'stalactitic', cn: '钟乳状', en: 'Stalactitic', desc: '像钟乳石一样向下垂挂或层状生长。', eg: '孔雀石、玛瑙' },
    { id: 'arborescent', cn: '树枝状', en: 'Arborescent', desc: '有主干与侧枝的立体树状，常见于自然铜、自然银。', eg: '珊瑚、自然铜' },
    { id: 'capillary', cn: '毛细管状', en: 'Capillary', desc: '细如毛发、可以弯曲的晶丝。', eg: '霓石、纤蛇纹石' },
    { id: 'foliated', cn: '片状', en: 'Foliated', desc: '容易沿一个方向剥成薄片，像一叠纸。', eg: '云母、石墨' },
    { id: 'reticulated', cn: '网状', en: 'Reticulated', desc: '晶体交织成网，常见于裂隙充填的矿脉。', eg: '绿松石铁线网' },
    { id: 'reniform', cn: '肾状', en: 'Reniform', desc: '表面圆润、像肾脏一样的块体，常与葡萄状共生。', eg: '孔雀石、红纹石' },
    { id: 'prismatic', cn: '棱柱状', en: 'Prismatic', desc: '柱状晶体，横截面是多边形。', eg: '祖母绿、海蓝宝' },
    { id: 'plumose', cn: '羽状', en: 'Plumose', desc: '细小晶体排成羽毛状。', eg: '绿帘石' },
    { id: 'tabular', cn: '平板状', en: 'Tabular', desc: '扁平的板状晶体，常呈透明薄片。', eg: '冰洲石' }
  ];


  var SYSTEMS = [
    { id: 'cubic', cn: '立方晶系', en: 'Cubic', cond: 'a = b = c；α = β = γ = 90°', eg: '钻石、石榴石、萤石、黄铁矿', link: ['diamond', 'garnet', 'fluorite'] },
    { id: 'tetragonal', cn: '四方晶系', en: 'Tetragonal', cond: 'a = b ≠ c；α = β = γ = 90°', eg: '锆石、方柱石、鱼眼石', link: ['zircon', 'scapolite', 'apophyllite'] },
    { id: 'hexagonal', cn: '六方晶系', en: 'Hexagonal', cond: 'a = b ≠ c；α = β = 90°，γ = 120°', eg: '绿柱石、磷灰石、电气石', link: ['emerald', 'aquamarine', 'fluorapatite'] },
    { id: 'trigonal', cn: '三方晶系', en: 'Trigonal', cond: 'a = b = c；α = β = γ ≠ 90°', eg: '石英、刚玉、方解石、碧玺', link: ['ruby', 'amethyst', 'tourmaline'] },
    { id: 'orthorhombic', cn: '斜方晶系', en: 'Orthorhombic', cond: 'a ≠ b ≠ c；α = β = γ = 90°', eg: '橄榄石、托帕石、重晶石', link: ['peridot', 'topaz', 'barite'] },
    { id: 'monoclinic', cn: '单斜晶系', en: 'Monoclinic', cond: 'a ≠ b ≠ c；α = γ = 90°，β ≠ 90°', eg: '蓝铜矿、孔雀石、雄黄', link: ['azurite', 'malachite', 'realgar'] },
    { id: 'triclinic', cn: '三斜晶系', en: 'Triclinic', cond: 'a ≠ b ≠ c；α ≠ β ≠ γ ≠ 90°', eg: '蓝晶石、滑石、蔷薇辉石', link: ['kyanite', 'talc', 'rhodonite'] }
  ];

  var SGS = [
    { id: 'P', cn: '简单立方', en: 'Simple Cubic', desc: '原子只在立方体的八个顶点。空间群符号里的 P 来自「初始位置」。', eg: '黄铁矿 Pa3' },
    { id: 'I', cn: '体心立方', en: 'Body-centered', desc: '顶点之外，立方体的中心还有一个原子，符号用 I 表示。', eg: '石榴石 Ia3d' },
    { id: 'F', cn: '面心立方', en: 'Face-centered', desc: '每个面的中心都有一个原子，符号用 F 表示，也叫立方密堆积。', eg: '方铅矿 Fm3m' }
  ];

  var HABIT_MAP = {};
  HABITS.forEach(function (h) { HABIT_MAP[h.id] = h; });

  function habitBody(id) {
    switch (id) {
      case 'massive':
        return '<path d="M30 30C40 18 62 16 72 28 84 40 82 64 68 76 54 88 32 84 24 68 16 52 20 40 30 30Z" fill="C" fill-opacity=".14"/><path d="M40 36 52 52 44 66M62 40 58 58"/>';
      case 'acicular':
        return '<path d="M34 88 30 26M44 88 46 18M54 88 58 24M64 88 70 34M24 88 20 40" stroke-width="2.4"/>';
      case 'bladed':
        return '<path d="M26 82 34 20 42 26 40 84Z" fill="C" fill-opacity=".14"/><path d="M48 84 54 14 62 20 60 86Z" fill="C" fill-opacity=".14"/><path d="M68 82 74 28 82 34 80 84Z" fill="C" fill-opacity=".14"/>';
      case 'dendritic':
        return '<path d="M50 90V30M50 62 34 44M50 54 66 38M34 44 28 28M66 38 74 24M50 70 38 60M50 46 58 32"/>';
      case 'botryoidal':
        return '<circle cx="38" cy="58" r="16" fill="C" fill-opacity=".14"/><circle cx="60" cy="50" r="18" fill="C" fill-opacity=".14"/><circle cx="50" cy="72" r="12" fill="C" fill-opacity=".14"/>';
      case 'druzy':
        return '<path d="M18 80H82"/><path d="M22 80 26 64 30 80M32 80 38 58 44 80M46 80 52 54 58 80M60 80 66 60 72 80M74 80 78 68 82 80"/>';
      case 'radiating':
        return '<path d="M50 88 20 30M50 88 34 22M50 88 50 16M50 88 66 22M50 88 80 30"/>';
      case 'stalactitic':
        return '<path d="M36 14H64L56 62 50 88 44 62Z" fill="C" fill-opacity=".14"/><path d="M36 26H64M38 40H62"/>';
      case 'arborescent':
        return '<path d="M50 90V24M50 60 34 42M50 52 66 34M34 42 30 26M66 34 72 20M50 72 38 62M50 44 58 30"/>';
      case 'capillary':
        return '<path d="M30 90c-4-16 6-24 2-40s4-24 2-36M44 92c-5-18 5-26 1-42s5-22 3-34M58 90c-4-16 6-24 2-40s4-24 2-36M72 88c-4-14 6-22 2-36"/>';
      case 'foliated':
        return '<path d="M30 62 50 48 76 56 56 70Z" fill="C" fill-opacity=".14"/><path d="M34 50 54 36 78 44 58 58"/><path d="M38 38 58 24 80 32 60 46"/>';
      case 'reticulated':
        return '<path d="M26 34c10-10 38-10 48 0s8 34-2 44-38 8-46-2-10-32 0-42Z" fill="C" fill-opacity=".1"/><path d="M30 30 70 70M40 26 80 58M22 44 58 80M60 26 30 64M76 36 46 72"/>';
      case 'reniform':
        return '<path d="M30 40c8-14 28-14 36 0s8 30-2 40-30 8-38-2-4-24 4-38Z" fill="C" fill-opacity=".14"/><path d="M38 48c6-6 16-6 22 0"/>';
      case 'prismatic':
        return '<path d="M50 10 66 22v56L50 90 34 78V22Z" fill="C" fill-opacity=".14"/><path d="M34 22 50 34 66 22M50 34v56"/>';
      case 'plumose':
        return '<path d="M50 92V12"/><path d="M50 30 34 22M50 30 66 22M50 42 30 32M50 42 70 32M50 54 28 44M50 54 72 44M50 66 32 58M50 66 68 58M50 78 38 72M50 78 62 72"/>';
      case 'tabular':
        return '<path d="M26 40 50 24 76 36 52 52Z" fill="C" fill-opacity=".14"/><path d="M26 40v10l26 12 24-16V36"/><path d="M52 52v10"/>';
      default:
        return '';
    }
  }



  function settingArt(id) {
    var gem = '<path d="M50 18 63 26V40L50 48 37 40V26Z"/><path d="M37 26 50 33 63 26M50 33V48"/>';
    var band = '<rect x="28" y="58" width="44" height="9"/>';
    var body = '';
    switch (id) {
      case 'prong':
        body = gem + band + '<path d="M30 60C28 44 33 34 40 28M70 60C72 44 67 34 60 28"/>';
        break;
      case 'bezel':
        body = gem + '<path d="M34 24C31 36 32 48 40 57H60C68 48 69 36 66 24"/><path d="M28 57H72V66H28Z"/>';
        break;
      case 'tension':
        body = gem + '<rect x="6" y="24" width="20" height="48"/><rect x="74" y="24" width="20" height="48"/>';
        break;
      case 'channel':
        body = '<rect x="8" y="24" width="84" height="10"/><rect x="8" y="56" width="84" height="10"/>' +
          '<circle cx="30" cy="45" r="7"/><circle cx="50" cy="45" r="7"/><circle cx="70" cy="45" r="7"/>';
        break;
      case 'bar':
        body = '<rect x="6" y="58" width="88" height="9"/>' +
          '<circle cx="24" cy="40" r="8"/><circle cx="50" cy="40" r="8"/><circle cx="76" cy="40" r="8"/>' +
          '<rect x="34" y="30" width="5" height="28"/><rect x="61" y="30" width="5" height="28"/>';
        break;
      case 'peg':
        body = '<circle cx="50" cy="30" r="14"/><path d="M50 44V62"/><ellipse cx="50" cy="66" rx="20" ry="6"/>';
        break;
      case 'invisible':
        body = '<rect x="14" y="30" width="18" height="18"/><rect x="41" y="30" width="18" height="18"/><rect x="68" y="30" width="18" height="18"/>' +
          '<path d="M14 48H86V58H14Z"/><path d="M22 30V22M50 30V22M78 30V22"/>';
        break;
      case 'fishtail':
        body = gem + '<path d="M32 56C32 44 38 38 44 34M68 56C68 44 62 38 56 34"/><path d="M32 56H68V65H32Z"/>';
        break;
      case 'gypsy':
        body = '<rect x="16" y="34" width="68" height="36"/><circle cx="50" cy="40" r="12"/><path d="M38 40H62"/>';
        break;
      case 'tiger':
        body = gem + band + '<path d="M30 60C28 44 33 34 40 28M40 28 36 22M40 28 44 22"/><path d="M70 60C72 44 67 34 60 28M60 28 56 22M60 28 64 22"/>';
        break;
      case 'spade':
        body = '<rect x="8" y="40" width="84" height="14"/>' +
          '<circle cx="24" cy="37" r="8"/><circle cx="48" cy="37" r="8"/><circle cx="72" cy="37" r="8"/>' +
          '<path d="M8 40C14 34 18 34 24 34M32 40C38 34 42 34 48 34M56 40C62 34 66 34 72 34M80 40C84 36 86 36 90 36"/>';
        break;
      case 'pave':
        body = '<rect x="10" y="28" width="80" height="40"/>' +
          '<circle cx="26" cy="40" r="7"/><circle cx="50" cy="40" r="7"/><circle cx="74" cy="40" r="7"/>' +
          '<circle cx="38" cy="58" r="7"/><circle cx="62" cy="58" r="7"/>';
        break;
      case 'wax':
        body = '<rect x="12" y="34" width="76" height="36" stroke-dasharray="4 3"/>' +
          '<circle cx="32" cy="30" r="8"/><circle cx="56" cy="30" r="8"/><circle cx="74" cy="44" r="7"/>';
        break;
      case 'fancy':
        body = gem + '<path d="M34 22C28 30 26 40 30 50 36 60 46 64 50 64 54 64 64 60 70 50 74 40 72 30 66 22"/>';
        break;
      case 'wrap':
        body = gem + '<path d="M30 24C22 36 24 50 34 56M70 24C78 36 76 50 66 56"/>' +
          '<path d="M22 34C18 44 22 54 32 58M78 34C82 44 78 54 68 58"/>';
        break;
      case 'snow':
        body = '<circle cx="50" cy="42" r="10"/>' +
          '<circle cx="50" cy="22" r="6"/><circle cx="70" cy="32" r="6"/><circle cx="70" cy="54" r="6"/>' +
          '<circle cx="50" cy="64" r="6"/><circle cx="30" cy="54" r="6"/><circle cx="30" cy="32" r="6"/>';
        break;
    }
    return '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">' +
      '<g fill="none" stroke="#A67C3D" stroke-width="1.25" stroke-linejoin="round" stroke-linecap="round">' + body + '</g></svg>';
  }

  function systemArt(id) {
    var body = '';
    switch (id) {
      case 'cubic':
        body = '<path d="M30 40 62 40 62 76 30 76Z"/><path d="M44 26 76 26 76 62 44 62Z"/><path d="M30 40 44 26M62 40 76 26M62 76 76 62M30 76 44 62"/>';
        break;
      case 'tetragonal':
        body = '<path d="M34 34 60 34 60 82 34 82Z"/><path d="M48 22 74 22 74 70 48 70Z"/><path d="M34 34 48 22M60 34 74 22M60 82 74 70M34 82 48 70"/>';
        break;
      case 'hexagonal':
        body = '<path d="M32 24 41 18 59 18 68 24 59 30 41 30Z"/><path d="M32 76 41 70 59 70 68 76 59 82 41 82Z"/><path d="M32 24v52M41 18v52M59 18v52M68 24v52"/>';
        break;
      case 'trigonal':
        body = '<path d="M30 44 60 50 60 78 30 72Z"/><path d="M44 30 74 36 74 64 44 58Z"/><path d="M30 44 44 30M60 50 74 36M60 78 74 64M30 72 44 58"/>';
        break;
      case 'orthorhombic':
        body = '<path d="M26 46 58 46 58 76 26 76Z"/><path d="M40 32 72 32 72 62 40 62Z"/><path d="M26 46 40 32M58 46 72 32M58 76 72 62M26 76 40 62"/>';
        break;
      case 'monoclinic':
        body = '<path d="M30 44 58 44 58 78 30 78Z"/><path d="M46 32 74 32 74 66 46 66Z"/><path d="M30 44 46 32M58 44 74 32M58 78 74 66M30 78 46 66"/>';
        break;
      case 'triclinic':
        body = '<path d="M28 46 58 52 58 80 28 74Z"/><path d="M44 32 74 38 74 66 44 60Z"/><path d="M28 46 44 32M58 52 74 38M58 80 74 66M28 74 44 60"/>';
        break;
    }
    return '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">' +
      '<g fill="none" stroke="#A67C3D" stroke-width="1.2" stroke-linejoin="round" stroke-linecap="round">' + body + '</g></svg>';
  }


  function axesArt() {
    return '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">' +
      '<g fill="none" stroke="#A67C3D" stroke-width="1.2" stroke-linecap="round">' +
      '<path d="M50 74 82 62"/><path d="M50 74 16 60"/><path d="M50 74V20"/>' +
      '</g>' +
      '<g fill="#A67C3D" font-family="Georgia, serif" font-size="9" font-style="italic">' +
      '<text x="84" y="64">a</text><text x="6" y="62">b</text><text x="46" y="14">c</text>' +
      '</g></svg>';
  }

  function latticeArt(id) {
    var cube = '<path d="M30 40 62 40 62 76 30 76Z"/><path d="M44 26 76 26 76 62 44 62Z"/><path d="M30 40 44 26M62 40 76 26M62 76 76 62M30 76 44 62"/>';
    var pts = [[30, 40], [62, 40], [62, 76], [30, 76], [44, 26], [76, 26], [76, 62], [44, 62]];
    if (id === 'I') pts.push([53, 51]);
    if (id === 'F') pts = pts.concat([[46, 58], [60, 44], [37, 51], [69, 51], [53, 33], [53, 69]]);
    var dots = pts.map(function (p) {
      return '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="2.4" fill="#A67C3D" stroke="none"/>';
    }).join('');
    return '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">' +
      '<g fill="none" stroke="#A67C3D" stroke-width="1.1" stroke-linejoin="round">' + cube + '</g>' + dots + '</svg>';
  }

  function habitArt(id, color) {
    var body = habitBody(id).split('"C"').join('"' + color + '"');
    return '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">' +
      '<g fill="none" stroke="#A67C3D" stroke-width="1.3" stroke-linejoin="round" stroke-linecap="round">' + body + '</g></svg>';
  }

  var MOHS_MINERALS = ['滑石', '石膏', '方解石', '萤石', '磷灰石', '长石', '石英', '黄玉', '刚玉', '金刚石'];

  var SUB = { '₀': '0', '₁': '1', '₂': '2', '₃': '3', '₄': '4', '₅': '5', '₆': '6', '₇': '7', '₈': '8', '₉': '9' };

  /* ------------------------------- 工具 ------------------------------- */

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function norm(s) {
    return String(s == null ? '' : s)
      .toLowerCase()
      .replace(/[₀-₉]/g, function (c) { return SUB[c]; })
      .replace(/[\s·・\-—_（）()［］\[\]:：,，、。.]+/g, '');
  }

  function pad3(n) { return String(n).padStart(3, '0'); }

  function midMohs(it) { return (it.mohs[0] + it.mohs[1]) / 2; }

  function fmtMohs(it) {
    return it.mohs[0] === it.mohs[1] ? String(it.mohs[0]) : it.mohs[0] + '–' + it.mohs[1];
  }

  function formulaHTML(it) {
    var f = it.formulaPlain || it.formula;
    if (!f) return esc(it.symbol || '');
    return esc(f).replace(/(\d+)/g, '<sub>$1</sub>');
  }

  function bucketOf(it) {
    return Math.min(10, Math.max(1, Math.round(midMohs(it))));
  }

  function debounce(fn, wait) {
    var t;
    return function () {
      var args = arguments;
      clearTimeout(t);
      t = setTimeout(function () { fn.apply(null, args); }, wait);
    };
  }

  /* ------------------------------- 数据 ------------------------------- */

  var GEM_ITEMS = GEMS.map(function (g, i) { return Object.assign({}, g, { kind: 'gem', no: i + 1 }); });
  var METAL_ITEMS = METALS.map(function (m, i) { return Object.assign({}, m, { kind: 'metal', no: i + 1 }); });

  var BY_ID = {};
  GEM_ITEMS.concat(METAL_ITEMS).forEach(function (it) {
    it._s = norm([it.name, it.en, (it.aliases || []).join(' '), it.formula, it.formulaPlain, it.symbol, it.id].join(' '));
    BY_ID[it.id] = it;
  });

  function itemsFor(view) { return view === 'metals' ? METAL_ITEMS : GEM_ITEMS; }

  /* ------------------------------- 状态 ------------------------------- */

  var state = {
    view: 'gems',
    q: '',
    sort: 'default',
    page: 1,
    filters: { hue: null, category: null, market: null, origin: null, birth: null, price: null, mohs: null },
    openId: null,
    moreOrigins: false,
    pages: 1,
    ledgerCat: '全部'
  };

  var closeTimer = null;
  var lastFocused = null;

  /* ------------------------------- 宝石线稿 ------------------------------- */

  function ring(cx, cy, rx, ry, n, rot) {
    var out = [];
    for (var i = 0; i < n; i++) {
      var a = (rot || 0) + i * 2 * Math.PI / n;
      out.push([+(cx + rx * Math.cos(a)).toFixed(1), +(cy + ry * Math.sin(a)).toFixed(1)]);
    }
    return out;
  }

  function P(pts) {
    return pts.map(function (p) { return p[0] + ',' + p[1]; }).join(' ');
  }

  function isLight(hex) {
    var h = String(hex || '').replace('#', '');
    if (h.length === 3) h = h.charAt(0) + h.charAt(0) + h.charAt(1) + h.charAt(1) + h.charAt(2) + h.charAt(2);
    var r = parseInt(h.slice(0, 2), 16), g = parseInt(h.slice(2, 4), 16), b = parseInt(h.slice(4, 6), 16);
    if (isNaN(r) || isNaN(g) || isNaN(b)) return false;
    return (0.299 * r + 0.587 * g + 0.114 * b) > 150;
  }

  function legacyArt(cut, color, opts) {
    opts = opts || {};
    var solid = opts.mode === 'solid';
    var edge = solid ? '#C9A25F' : '#A67C3D';
    var facet = solid
      ? (isLight(color) ? 'rgba(33,28,23,.34)' : 'rgba(247,242,233,.5)')
      : 'rgba(166,124,61,.66)';
    var fillOpacity = solid ? 1 : 0.19;
    var body = '';
    var facets = '';

    if (cut === 'round') {
      var table = ring(50, 50, 21, 21, 8, -Math.PI / 8);
      body = '<circle cx="50" cy="50" r="41"/>';
      facets = '<polygon points="' + P(table) + '"/>' + table.map(function (p, i) {
        var a = -Math.PI / 8 + i * Math.PI / 4;
        return '<path d="M' + p[0] + ' ' + p[1] + 'L' + (50 + 41 * Math.cos(a)).toFixed(1) + ' ' + (50 + 41 * Math.sin(a)).toFixed(1) + '"/>';
      }).join('');
    } else if (cut === 'oval') {
      var oOut = ring(50, 50, 30, 42, 12, -Math.PI / 2);
      var oIn = ring(50, 50, 15, 23, 12, -Math.PI / 2);
      body = '<ellipse cx="50" cy="50" rx="30" ry="42"/>';
      facets = '<polygon points="' + P(oIn) + '"/>' + oIn.map(function (p, i) {
        return '<path d="M' + p[0] + ' ' + p[1] + 'L' + oOut[i][0] + ' ' + oOut[i][1] + '"/>';
      }).join('');
    } else if (cut === 'emerald') {
      function oct(inset) {
        var x1 = 12 + inset, x2 = 88 - inset, y1 = 17 + inset, y2 = 83 - inset, c = 12;
        return 'M' + (x1 + c) + ' ' + y1 + 'H' + (x2 - c) + 'L' + x2 + ' ' + (y1 + c) +
          'V' + (y2 - c) + 'L' + (x2 - c) + ' ' + y2 + 'H' + (x1 + c) + 'L' + x1 + ' ' + (y2 - c) +
          'V' + (y1 + c) + 'Z';
      }
      body = '<path d="' + oct(0) + '"/>';
      facets = '<path d="' + oct(9) + '"/><path d="' + oct(18) + '"/>';
    } else if (cut === 'pear') {
      var pd = 'M50 6C58 18 84 38 84 62C84 82 69 94 50 94C31 94 16 82 16 62C16 38 42 18 50 6Z';
      body = '<path d="' + pd + '"/>';
      facets = '<path d="' + pd + '" transform="translate(50 58) scale(.68) translate(-50 -58)"/>';
    } else if (cut === 'marquise') {
      var md = 'M50 5C70 25 84 42 84 50C84 58 70 75 50 95C30 75 16 58 16 50C16 42 30 25 50 5Z';
      body = '<path d="' + md + '"/>';
      facets = '<path d="' + md + '" transform="translate(50 50) scale(.64) translate(-50 -50)"/>' +
        '<path d="M50 5V95"/>';
    } else if (cut === 'cabochon') {
      body = '<ellipse cx="50" cy="50" rx="36" ry="29"/>';
      facets = '<ellipse cx="50" cy="50" rx="25" ry="19"/>' +
        '<path d="M24 44C27 33 37 26 50 25"/>';
    } else if (cut === 'raw') {
      body = '<path d="M32 26 54 12 74 20 88 46 78 72 56 88 34 80 16 56Z"/>';
      facets = '<path d="M54 12 55 48 88 46M88 46 55 48 78 72M78 72 55 48 56 88M56 88 55 48 16 56M16 56 55 48 32 26M32 26 55 48 74 20"/>';
    } else if (cut === 'sphere') {
      body = '<circle cx="50" cy="50" r="38"/>';
      facets = '<path d="M19 41c4-13 16-22 31-22"/><path d="M28 69c7 9 18 13 29 10"/>';
    } else if (cut === 'ingot') {
      body = '<path d="M24 40 36 28H84L72 40Z"/>' +
        '<path d="M24 40H72V68H24Z"/>' +
        '<path d="M72 40 84 28V56L72 68Z"/>';
      facets = '<path d="M24 40h48M36 28v12M84 28v12"/>';
    }

    return '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">' +
      '<g fill="' + color + '" fill-opacity="' + fillOpacity + '" stroke="' + edge + '" stroke-width="' + (solid ? 1.2 : 1.4) + '" stroke-linejoin="round">' + body + '</g>' +
      '<g fill="none" stroke="' + facet + '" stroke-width="' + (solid ? 0.9 : 0.9) + '" stroke-linejoin="round" stroke-linecap="round">' + facets + '</g>' +
      '</svg>';
  }



  function meteorArt(kind, color, opts) {
    var solid = opts && opts.mode === 'solid';
    var edge = solid ? '#C9A25F' : '#A67C3D';
    var id = 'met' + (++artSeq);
    var head = '<circle cx="50" cy="50" r="40" fill="' + color + '" fill-opacity="' + (solid ? 1 : 0.2) +
      '" stroke="' + edge + '" stroke-width="1.2"/>';
    if (kind === 'meteorite') {
      var lines = '';
      for (var k = -70; k <= 70; k += 12) {
        lines += '<path d="M' + (50 + k - 60) + ' 0L' + (50 + k + 60) + ' 100"/>';
        lines += '<path d="M' + (50 + k + 60) + ' 0L' + (50 + k - 60) + ' 100"/>';
      }
      return '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">' +
        '<defs><clipPath id="' + id + '"><circle cx="50" cy="50" r="40"/></clipPath></defs>' + head +
        '<g clip-path="url(#' + id + ')" fill="none" stroke="' + (solid ? 'rgba(247,242,233,.55)' : 'rgba(120,84,38,.55)') +
        '" stroke-width=".7">' + lines + '</g></svg>';
    }
    var ol = [
      'M38 28 50 24 57 36 48 44Z',
      'M62 42 73 46 71 58 60 56Z',
      'M38 56 50 52 55 64 43 69Z',
      'M56 66 67 64 69 77 58 80Z',
      'M28 42 34 38 36 48 30 50Z'
    ];
    var blobs = ol.map(function (d) {
      return '<path d="' + d + '" fill="#7FA85A" fill-opacity="' + (solid ? 0.95 : 0.4) + '" stroke="#4A6B3A" stroke-width=".7"/>';
    }).join('');
    return '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">' +
      '<defs><clipPath id="' + id + '"><circle cx="50" cy="50" r="40"/></clipPath></defs>' +
      '<circle cx="50" cy="50" r="40" fill="#9A9A98" fill-opacity="' + (solid ? 1 : 0.3) + '" stroke="' + edge + '" stroke-width="1.2"/>' +
      '<g clip-path="url(#' + id + ')">' + blobs + '</g></svg>';
  }


  function dziArt(id) {
    var eyeSets = {
      eye1: [[50, 50, 8]],
      eye2: [[42, 50, 7], [58, 50, 7]],
      eye3: [[34, 50, 6.2], [50, 50, 6.2], [66, 50, 6.2]],
      eye4: [[42, 40, 5.6], [58, 40, 5.6], [42, 60, 5.6], [58, 60, 5.6]],
      eye5: [[36, 40, 5.2], [50, 40, 5.2], [64, 40, 5.2], [43, 60, 5.2], [57, 60, 5.2]],
      eye6: [[36, 40, 5], [50, 40, 5], [64, 40, 5], [36, 60, 5], [50, 60, 5], [64, 60, 5]],
      eye7: [[36, 37, 4.6], [50, 37, 4.6], [64, 37, 4.6], [36, 50, 4.6], [50, 50, 4.6], [64, 50, 4.6], [50, 63, 4.6]],
      eye8: [[36, 37, 4.4], [50, 37, 4.4], [64, 37, 4.4], [36, 50, 4.4], [50, 50, 4.4], [64, 50, 4.4], [43, 63, 4.4], [57, 63, 4.4]],
      eye9: [[36, 36, 4.2], [50, 36, 4.2], [64, 36, 4.2], [36, 50, 4.2], [50, 50, 4.2], [64, 50, 4.2], [36, 64, 4.2], [50, 64, 4.2], [64, 64, 4.2]],
      eye11: [[38, 36, 3.4], [50, 36, 3.4], [62, 36, 3.4], [38, 46, 3.4], [50, 46, 3.4], [62, 46, 3.4], [38, 56, 3.4], [50, 56, 3.4], [62, 56, 3.4], [44, 66, 3.4], [56, 66, 3.4]]
    };
    var bead = '<path d="M34 26H66Q90 26 90 50Q90 74 66 74H34Q10 74 10 50Q10 26 34 26Z"/>' +
      '<path d="M24 27V73M76 27V73"/>';
    var inner = '';
    if (eyeSets[id]) {
      inner = eyeSets[id].map(function (e) {
        return '<circle cx="' + e[0] + '" cy="' + e[1] + '" r="' + e[2] + '"/>' +
          '<circle cx="' + e[0] + '" cy="' + e[1] + '" r="' + (e[2] * 0.42).toFixed(1) + '"/>';
      }).join('');
    } else if (id === 'tiger') {
      inner = '<path d="M34 30 42 70M46 28 54 72M58 30 66 70"/>';
    } else if (id === 'heavenearth') {
      inner = '<circle cx="50" cy="40" r="8"/><rect x="42" y="52" width="16" height="14"/>';
    } else if (id === 'vase') {
      inner = '<path d="M44 32h12M47 32v6c0 4-6 6-6 11 0 6 5 9 9 9s9-3 9-9c0-5-6-7-6-11v-6"/>';
    } else if (id === 'lotus') {
      inner = '<path d="M50 64c-8 0-14-5-15-12 6 1 11 5 15 12zM50 64c8 0 14-5 15-12-6 1-11 5-15 12zM50 64c-5-5-6-11-3-16 3 5 4 11 3 16zM50 64c5-5 6-11 3-16-3 5-4 11-3 16z"/>';
    }
    return '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">' +
      '<g fill="#E8DCC4" fill-opacity=".4" stroke="#A67C3D" stroke-width="1.2" stroke-linejoin="round">' + bead + '</g>' +
      '<g fill="none" stroke="#A67C3D" stroke-width="1">' + inner + '</g></svg>';
  }

  function art(cut, color, opts) {
    if (cut === 'dzi') return dziArt('eye3');
    if (cut === 'meteorite' || cut === 'pallasite') return meteorArt(cut, color, opts);
    if (LEGACY_CUT[cut]) return legacyArt(cut, color, opts);
    var def = CUT_MAP[cut];
    if (def) return cutSVG(def, color, opts);
    return legacyArt('round', color, opts);
  }

  /* ------------------------------- 过滤 ------------------------------- */

  function searchText(it) { return it._s; }

  function filtered() {
    var q = norm(state.q);
    var f = state.filters;
    var base = q ? GEM_ITEMS.concat(METAL_ITEMS) : itemsFor(state.view);
    return base.filter(function (it) {
      if (q && searchText(it).indexOf(q) === -1) return false;
      if (f.hue && (it.hues || []).indexOf(f.hue) === -1) return false;
      if (f.price && it.priceTier !== f.price) return false;
      if (f.mohs && bucketOf(it) !== f.mohs) return false;
      if (f.origin && (it.origins || []).indexOf(f.origin) === -1) return false;
      if (state.view === 'gems') {
        if (f.category && it.category !== f.category) return false;
        if (f.market && (it.market || []).indexOf(f.market) === -1) return false;
        if (f.birth && it.birthstone !== f.birth) return false;
      }
      return true;
    });
  }

  function sorted(list) {
    var arr = list.slice();
    switch (state.sort) {
      case 'mohs-asc':
        return arr.sort(function (a, b) { return a.mohs[0] - b.mohs[0] || a.mohs[1] - b.mohs[1]; });
      case 'mohs-desc':
        return arr.sort(function (a, b) { return b.mohs[0] - a.mohs[0] || b.mohs[1] - a.mohs[1]; });
      case 'price-desc':
        return arr.sort(function (a, b) { return b.priceTier - a.priceTier; });
      case 'price-asc':
        return arr.sort(function (a, b) { return a.priceTier - b.priceTier; });
      case 'name':
        return arr.sort(function (a, b) { return a.name.localeCompare(b.name, 'zh'); });
      default:
        return arr;
    }
  }

  /* ------------------------------- 渲染：硬度尺 ------------------------------- */

  function renderRuler() {
    var plot = $('#mohsPlot');
    var axis = $('#mohsAxis');
    var items = itemsFor(state.view);
    var width = plot.clientWidth || 900;
    var gap = (24 / width) * 100;

    var sortedItems = items.slice().sort(function (a, b) { return midMohs(a) - midMohs(b); });
    var lanes = [];
    var html = '';

    sortedItems.forEach(function (it) {
      var x = ((midMohs(it) - 0.5) / 10) * 100;
      var lane = -1;
      for (var i = 0; i < lanes.length; i++) {
        if (x - lanes[i] >= gap) { lane = i; break; }
      }
      if (lane === -1) { lane = lanes.length; lanes.push(x); }
      else { lanes[lane] = x; }

      var color = (it.colors && it.colors[0] && it.colors[0].hex) || '#A67C3D';
      html += '<button class="mk" type="button" data-id="' + it.id + '" style="left:' + x.toFixed(2) + '%;bottom:' + (lane * 18) + 'px;--c:' + color + '"' +
        ' aria-label="' + esc(it.name) + '，硬度 ' + fmtMohs(it) + '" title="' + esc(it.name) + ' · ' + fmtMohs(it) + '">' +
        '<i></i><span class="mk__tip">' + esc(it.name) + ' · ' + fmtMohs(it) + '</span></button>';
    });

    plot.innerHTML = html;
    plot.style.height = Math.max(34, lanes.length * 18 + 10) + 'px';

    var axisHTML = '';
    for (var n = 1; n <= 10; n++) {
      axisHTML += '<button class="mohs__cell" type="button" data-n="' + n + '" aria-pressed="false"' +
        ' title="显示硬度约 ' + n + ' 的石头">' +
        '<b>' + n + '</b><small>' + MOHS_MINERALS[n - 1] + '</small></button>';
    }
    axis.innerHTML = axisHTML;

    syncRuler();
  }

  function syncRuler() {
    var ids = {};
    filtered().forEach(function (it) { ids[it.id] = true; });
    $$('#mohsPlot .mk').forEach(function (mk) {
      mk.classList.toggle('is-off', !ids[mk.dataset.id]);
    });
    $$('#mohsAxis .mohs__cell').forEach(function (cell) {
      var on = state.filters.mohs === Number(cell.dataset.n);
      cell.classList.toggle('is-on', on);
      cell.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
  }

  /* ------------------------------- 渲染：筛选栏 ------------------------------- */

  function countBy(list, fn) {
    var map = {};
    list.forEach(function (it) {
      fn(it).forEach(function (v) {
        map[v] = (map[v] || 0) + 1;
      });
    });
    return map;
  }

  function presentHues(items) {
    var used = {};
    items.forEach(function (it) { (it.hues || []).forEach(function (h) { used[h] = true; }); });
    return HUES.filter(function (h) { return used[h.id]; });
  }

  function renderRail() {
    var items = itemsFor(state.view);
    var isGems = state.view === 'gems';
    var html = '';

    // 色系
    html += '<section class="facet"><h3>色系<em>COLOR</em></h3><div class="hues">';
    presentHues(items).forEach(function (h) {
      html += '<button class="hue" type="button" data-facet="hue" data-val="' + h.id + '" aria-pressed="false" title="' + h.name + '">' +
        '<span class="hue__dot" style="--c:' + h.hex + '"></span><span>' + h.name + '</span></button>';
    });
    html += '</div></section>';

    if (isGems) {
      var cats = Object.keys(countBy(items, function (it) { return [it.category]; }));
      html += '<section class="facet"><h3>类别<em>TYPE</em></h3><div class="chips">';
      ['宝石', '玉石', '有机宝石', '矿石晶体', '人工材料', '法器'].forEach(function (c) {
        if (cats.indexOf(c) > -1) {
          html += '<button class="chip" type="button" data-facet="category" data-val="' + esc(c) + '" aria-pressed="false">' + c + '</button>';
        }
      });
      html += '</div></section>';

      var markets = Object.keys(countBy(items, function (it) { return it.market || []; }));
      html += '<section class="facet"><h3>处理方式<em>TREATMENT</em></h3><div class="chips">';
      MARKETS.forEach(function (m) {
        if (markets.indexOf(m) > -1) {
          html += '<button class="chip" type="button" data-facet="market" data-val="' + esc(m) + '" aria-pressed="false">' + m + '</button>';
        }
      });
      html += '</div></section>';
    }

    // 产地
    var origins = countBy(items, function (it) { return it.origins || []; });
    var originList = Object.keys(origins).sort(function (a, b) { return origins[b] - origins[a] || a.localeCompare(b, 'zh'); });
    html += '<section class="facet"><h3>产地<em>ORIGIN</em></h3><div class="chips" id="originChips">';
    originList.forEach(function (o, i) {
      html += '<button class="chip" type="button" data-facet="origin" data-val="' + esc(o) + '" aria-pressed="false"' +
        (i >= 10 ? ' data-more="1" hidden' : '') + '>' + esc(o) + '</button>';
    });
    html += '</div>';
    if (originList.length > 10) {
      html += '<button class="link" type="button" id="moreOrigins" style="margin-top:7px">更多 ' + (originList.length - 10) + ' 个</button>';
    }
    html += '</section>';

    if (isGems) {
      var months = {};
      items.forEach(function (it) { if (it.birthstone) months[it.birthstone] = true; });
      html += '<section class="facet"><h3>诞生石<em>BIRTHSTONE</em></h3><div class="chips">';
      for (var m = 1; m <= 12; m++) {
        if (months[m]) {
          html += '<button class="chip" type="button" data-facet="birth" data-val="' + m + '" aria-pressed="false">' + m + ' 月</button>';
        }
      }
      html += '</div></section>';
    }

    var prices = {};
    items.forEach(function (it) { prices[it.priceTier] = true; });
    html += '<section class="facet"><h3>价格档<em>PRICE</em></h3><div class="chips">';
    for (var p = 1; p <= 4; p++) {
      if (prices[p]) {
        html += '<button class="chip" type="button" data-facet="price" data-val="' + p + '" aria-pressed="false">' +
          PRICE[p].label + '<span style="opacity:.5;margin-left:3px">' + PRICE[p].sym + '</span></button>';
      }
    }
    html += '</div></section>';

    $('#railBody').innerHTML = html;
    state.moreOrigins = false;
    syncRail();
  }

  function syncRail() {
    $$('#railBody [data-facet]').forEach(function (el) {
      var f = el.dataset.facet;
      var v = el.dataset.val;
      var on = String(state.filters[f]) === String(v);
      el.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    var hasFilter = Object.keys(state.filters).some(function (k) { return state.filters[k] != null; }) || state.q;
    $('#resetBtn').hidden = !hasFilter;
  }

  /* ------------------------------- 渲染：结果 ------------------------------- */

  function cardHTML(it) {
    var color = (it.colors && it.colors[0] && it.colors[0].hex) || '#A67C3D';
    var stats = it.kind === 'metal'
      ? [['硬度', fmtMohs(it)], ['密度', it.density], ['纯度', (it.purity && it.purity[0]) || '—']]
      : [['硬度', fmtMohs(it)], ['密度', it.density], ['稀有度', it.rarity]];

    var tags = (it.market || []).slice(0, 3).map(function (m) {
      return '<span class="tag" data-t="' + esc(m) + '">' + esc(m) + '</span>';
    }).join('');

    var sw = (it.colors || []).slice(0, 4).map(function (c) {
      return '<i style="--c:' + c.hex + '" title="' + esc(c.label) + '"></i>';
    }).join('');

    return '<a class="card" href="#/' + (it.kind === 'metal' ? 'metal' : 'gem') + '/' + it.id + '" data-id="' + it.id + '">' +
      '<span class="card__art" title="切工示意" aria-hidden="true">' + art(it.cut, color, { mode: 'line' }) + '</span>' +
      '<span class="card__kicker"><span>No. ' + pad3(it.no) + '</span><span class="card__cat">' + esc(it.category) + '</span></span>' +
      '<h3 class="card__name">' + esc(it.name) + '<em>' + esc(it.en) + '</em></h3>' +
      '<span class="card__formula">' + formulaHTML(it) + '</span>' +
      '<span class="card__hook">' + esc(it.hook || '') + '</span>' +
      '<span class="card__stats">' + stats.map(function (s) {
        return '<span class="card__stat"><b>' + esc(s[1]) + '</b><span>' + esc(s[0]) + '</span></span>';
      }).join('') + '</span>' +
      '<span class="card__foot"><span class="card__sw">' + sw + '</span><span class="card__tags">' + tags + '</span></span>' +
      '</a>';
  }

  function renderGrid() {
    var list = sorted(filtered());
    var total = list.length;
    var pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
    if (state.page > pages) state.page = pages;

    var slice = list.slice((state.page - 1) * PAGE_SIZE, state.page * PAGE_SIZE);
    var grid = $('#grid');
    grid.innerHTML = slice.map(cardHTML).join('');

    state.pages = pages;
    $('#empty').hidden = total !== 0;
    $('#pager').hidden = pages <= 1;
    $('#pager').innerHTML = pages > 1 ? pagerHTML(state.page, pages) : '';

    $('#resultCount').innerHTML = (state.q ? '全库搜索 · ' : '') +
      '<b>' + total + '</b> 件标本 · 第 ' + state.page + ' / ' + pages + ' 页 · 每页 ' + PAGE_SIZE;
    renderActiveChips();
    syncRuler();
    syncRail();
  }

  function pagerHTML(page, pages) {
    var out = '<button type="button" data-page="' + (page - 1) + '"' + (page === 1 ? ' disabled' : '') + '>上一页</button>';
    for (var i = 1; i <= pages; i++) {
      if (i === 1 || i === pages || Math.abs(i - page) <= 1) {
        out += '<button type="button" data-page="' + i + '"' + (i === page ? ' aria-current="page"' : '') + '>' + i + '</button>';
      } else if (Math.abs(i - page) === 2) {
        out += '<span>…</span>';
      }
    }
    out += '<button type="button" data-page="' + (page + 1) + '"' + (page === pages ? ' disabled' : '') + '>下一页</button>';
    out += '<span class="pager__jump">跳至' +
      '<input id="pageJump" type="number" min="1" max="' + pages + '" value="' + page + '" inputmode="numeric" aria-label="跳转到第几页">' +
      '页<button type="button" data-jump="1">跳转</button></span>';
    return out;
  }

  function filterChips() {
    var f = state.filters;
    var out = [];
    if (state.q) out.push({ k: 'q', v: '', label: '“' + state.q + '”' });
    if (f.hue) out.push({ k: 'hue', v: f.hue, label: HUE_MAP[f.hue] ? HUE_MAP[f.hue].name : f.hue });
    if (f.category) out.push({ k: 'category', v: f.category, label: f.category });
    if (f.market) out.push({ k: 'market', v: f.market, label: '处理：' + f.market });
    if (f.origin) out.push({ k: 'origin', v: f.origin, label: f.origin });
    if (f.birth) out.push({ k: 'birth', v: f.birth, label: f.birth + ' 月生辰石' });
    if (f.price) out.push({ k: 'price', v: f.price, label: PRICE[f.price].label });
    if (f.mohs) out.push({ k: 'mohs', v: f.mohs, label: '硬度 ' + f.mohs });
    return out;
  }

  function renderActiveChips() {
    var chips = filterChips();
    $('#activeChips').innerHTML = chips.map(function (c) {
      return '<span class="ac">' + esc(c.label) +
        '<button type="button" data-remove="' + c.k + '" aria-label="移除筛选 ' + esc(c.label) + '">×</button></span>';
    }).join('');
  }

  /* ------------------------------- 渲染：详情 ------------------------------- */

  function sectionHTML(cn, en, inner) {
    return '<section class="sec"><h3>' + cn + '<em>' + en + '</em></h3>' + inner + '</section>';
  }

  function detailHTML(it) {
    var color = (it.colors && it.colors[0] && it.colors[0].hex) || '#A67C3D';
    var isMetal = it.kind === 'metal';
    var eyebrow = isMetal
      ? esc(it.category) + ' · 铸锭示意'
      : esc(it.category) + ' · 切工示意 · ' + (CUT_LABEL[it.cut] || '');
    var out = '';

    out += '<div class="band">' +
      '<span class="band__eyebrow">' + eyebrow + '</span>' +
      '<div class="band__art">' + art(it.cut, color, { mode: 'solid' }) + '</div>' +
      '<h2 id="drawerTitle">' + esc(it.name) + '</h2>' +
      '<p class="band__en">' + esc(it.en) + '</p>' +
      '<p class="band__formula">' + formulaHTML(it) + '</p>' +
      '</div>';

    out += '<div class="detail">';
    out += '<p class="detail__hook">' + esc(it.hook || '') + '</p>';

    out += '<div class="keyfigs">';
    out += '<div class="keyfig"><b>' + fmtMohs(it) + '</b><span>莫氏硬度</span></div>';
    out += '<div class="keyfig"><b>' + esc(it.density) + '</b><span>密度 g/cm³</span></div>';
    if (isMetal) {
      out += '<div class="keyfig"><b>' + esc(it.purity[0]) + '</b><span>常见纯度</span></div>';
      out += '<div class="keyfig"><b>' + PRICE[it.priceTier].label + '</b><span>价格档 ' + PRICE[it.priceTier].sym + '</span></div>';
    } else {
      out += '<div class="keyfig"><b>' + esc(it.rarity) + '</b><span>稀有度</span></div>';
      out += '<div class="keyfig"><b>' + PRICE[it.priceTier].label + '</b><span>价格档 ' + PRICE[it.priceTier].sym + '</span></div>';
    }
    out += '</div>';

    // 物性
    var spec = '';
    if (isMetal) {
      spec += '<div><dt>元素符号</dt><dd class="mono">' + esc(it.symbol) + '</dd></div>';
      spec += '<div><dt>常见纯度</dt><dd>' + esc(it.purity.join(' / ')) + '</dd></div>';
      spec += '<div><dt>莫氏硬度</dt><dd>' + fmtMohs(it) + '</dd></div>';
      spec += '<div><dt>密度</dt><dd>' + esc(it.density) + ' g/cm³</dd></div>';
      spec += '<div><dt>颜色</dt><dd>' + it.colors.map(function (c) { return c.label; }).join('、') + '</dd></div>';
      spec += '<div><dt>用途</dt><dd>' + esc(it.uses.join('、')) + '</dd></div>';
    } else {
      spec += '<div><dt>化学式</dt><dd class="mono">' + formulaHTML(it) + '</dd></div>';
      spec += '<div><dt>晶系</dt><dd>' + esc(it.crystal) + '</dd></div>';
      if (it.habit && it.habit.length) {
        spec += '<div class="spec-wide"><dt>晶体习性</dt><dd class="habitrow">' +
          it.habit.map(function (h) {
            var hd = HABIT_MAP[h];
            return '<span class="habit-tag">' + (hd ? hd.cn : h) + '</span>';
          }).join('') + '</dd></div>';
      }
      spec += '<div><dt>光泽</dt><dd>' + esc(it.luster) + '</dd></div>';
      spec += '<div><dt>透明度</dt><dd>' + esc(it.transparency) + '</dd></div>';
      spec += '<div><dt>解理 / 断口</dt><dd>' + esc(it.cleavage) + '</dd></div>';
      if (it.streak) spec += '<div><dt>条痕</dt><dd>' + esc(it.streak) + '</dd></div>';
      if (it.magnet) spec += '<div><dt>磁性</dt><dd>' + esc(it.magnet) + '</dd></div>';
      if (it.fluor) spec += '<div><dt>荧光</dt><dd>' + esc(it.fluor) + '</dd></div>';
      spec += '<div><dt>颜色</dt><dd>' + it.colors.map(function (c) { return c.label; }).join('、') + '</dd></div>';
    }
    out += sectionHTML('物性', 'PROPERTIES', '<dl class="spec">' + spec + '</dl>');

    // 产地 / 价格
    var originTags = (it.origins || []).map(function (o) {
      return '<button class="chip" type="button" data-facet="origin" data-val="' + esc(o) + '">' + esc(o) + '</button>';
    }).join('');
    var originInner = '<div class="tagrow">' + originTags + '</div>' +
      '<p style="margin-top:10px">' + esc(it.priceNote) + '</p>';
    if (!isMetal && it.birthstone) {
      originInner += '<p style="margin-top:6px;font-size:11px;color:var(--ink-3)">' + it.birthstone + ' 月生辰石</p>';
    }
    out += sectionHTML('产地与价格', 'ORIGIN & PRICE', originInner);

    // 处理与真伪
    if (!isMetal) {
      var marketTags = (it.market || []).map(function (m) {
        return '<span class="tag" data-t="' + esc(m) + '">' + esc(m) + '</span>';
      }).join('');
      var treatList = (it.treatments || []).map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('');
      out += sectionHTML('处理与真伪', 'TREATMENT', '<div class="tagrow">' + marketTags + '</div>' +
        '<ul class="minilist" style="margin-top:10px">' + treatList + '</ul>' +
        '<p class="fineprint">以上为该石种在市场上的常见状态，不代表每一颗都经过处理；购买时应要求书面披露。</p>');
    } else {
      out += sectionHTML('氧化与过敏', 'TARNISH & ALLERGY',
        '<p>' + esc(it.tarnish) + '</p>' +
        '<p style="margin-top:8px"><b style="font-weight:500">过敏：</b>' + esc(it.allergy) + '</p>');
    }

    // 做首饰
    if (it.jewelry) {
      var wearHTML = JEWELRY.map(function (j) {
        var v = it.jewelry[j.id] || 0;
        var cls = v === 2 ? 'rec' : v === 1 ? 'ok' : 'no';
        var mark = v === 2 ? '●' : v === 1 ? '○' : '×';
        return '<span class="wear wear--' + cls + '"><i>' + mark + '</i>' + j.name + '</span>';
      }).join('');
      var cutHTML = (it.cuts || []).map(function (c) {
        return '<span class="cutchip">' + (CUT_LABEL[c] || c) + '</span>';
      }).join('') || '<span class="cutchip cutchip--none">—</span>';

      out += sectionHTML('做首饰', 'JEWELRY',
        '<p>' + esc(it.jewelryNote || '') + '</p>' +
        '<div class="weargrid">' + wearHTML + '</div>' +
        '<p class="fineprint">● 推荐　○ 可戴，需注意　× 不建议贴身佩戴</p>' +
        '<div class="cutrow"><b>推荐切工</b>' + cutHTML + '</div>' +
        (it.cutNote ? '<p class="fineprint">' + esc(it.cutNote) + '</p>' : ''));
    }

    // 天珠纹样
    if (it.motifs) {
      out += sectionHTML('纹样', 'MOTIFS',
        '<div class="motifgrid">' + it.motifs.map(function (m) {
          return '<figure class="motifcard">' +
            '<div class="motifcard__art">' + dziArt(m.id) + '</div>' +
            '<figcaption><b>' + esc(m.cn) + '</b><span>' + esc(m.note) + '</span></figcaption>' +
            '</figure>';
        }).join('') + '</div>' +
        '<p class="fineprint">眼纹数量是传统纹样与市场分级，不代表功效；「至纯」的年代判断需要专业鉴定。</p>');
    }

    // 传说
    out += sectionHTML('传说与象征', 'LEGEND',
      '<p>' + esc(it.legend) + '</p>' +
      '<p class="fineprint">传说与民俗材料，不是科学结论。</p>');

    // 创作提示
    out += sectionHTML('创作提示', 'FOR WRITERS', '<p>' + esc(it.creation) + '</p>');

    // 常见误用
    if (it.misuse && it.misuse.length) {
      out += sectionHTML('常见误用', 'COMMON MISTAKES',
        '<ul class="minilist minilist--x">' + it.misuse.map(function (m) { return '<li>' + esc(m) + '</li>'; }).join('') + '</ul>');
    }

    // 保养与安全
    var care = (it.care || []).map(function (c) { return '<li>' + esc(c) + '</li>'; }).join('');
    var toxic = /有毒|含砷|含汞|砷|汞/.test(it.safety);
    var safetyBlock = toxic
      ? '<div class="warn"><b>安全提示</b>' + esc(it.safety) + '</div>'
      : '<p class="fineprint" style="margin-top:10px">安全：' + esc(it.safety) + '</p>';
    out += sectionHTML('保养与安全', 'CARE & SAFETY',
      '<ul class="minilist minilist--care">' + care + '</ul>' + safetyBlock);

    // 相似
    if (!isMetal) {
      var sims = (it.similar || []).map(function (id) {
        var s = BY_ID[id];
        if (!s) return '';
        var c = s.colors && s.colors[0] ? s.colors[0].hex : '#A67C3D';
        return '<a class="sim" href="#/' + (s.kind === 'metal' ? 'metal' : 'gem') + '/' + s.id + '">' +
          '<i style="--c:' + c + '"></i>' + esc(s.name) + '<em>' + esc(s.en) + '</em></a>';
      }).join('');
      var simInner = (sims ? '<div class="simrow">' + sims + '</div>' : '') +
        (it.similarExtra ? '<p class="fineprint">另：' + esc(it.similarExtra) + '</p>' : '');
      if (simInner) out += sectionHTML('相似宝石', 'LOOK-ALIKES', simInner);
    }

    out += '<div class="detail__foot">' +
      '<span class="detail__no">BAOPU · No. ' + pad3(it.no) + ' · 切工为示意</span>' +
      '<button class="printbtn" type="button" id="printBtn">打印 A5 珠宝标签</button>' +
      '</div>';

    out += '</div>';
    return out;
  }

  function printHTML(it) {
    var color = (it.colors && it.colors[0] && it.colors[0].hex) || '#A67C3D';
    var isMetal = it.kind === 'metal';
    var rows = '';

    if (!isMetal) {
      rows += '<p><b>处理</b>' + esc((it.market || []).join(' / ')) + '</p>';
      rows += '<p><b>保养</b>' + esc((it.care || []).slice(0, 2).join('；')) + '</p>';
    } else {
      rows += '<p><b>纯度</b>' + esc(it.purity.join(' / ')) + '</p>';
      rows += '<p><b>保养</b>' + esc(it.care[0]) + '</p>';
    }
    rows += '<p><b>产地</b>' + esc((it.origins || []).slice(0, 4).join('、') || '—') + '</p>';

    return '<div class="label">' +
      '<div class="label__top"><span>宝谱 BAOPU</span><span>JEWELRY LABEL · 珠宝标签</span></div>' +
      '<div class="label__main">' +
      '<div class="label__art">' + art(it.cut, color, { mode: 'line' }) + '</div>' +
      '<p class="label__caption">' + (isMetal ? '铸锭示意' : '切工示意 · ' + (CUT_LABEL[it.cut] || '')) + '</p>' +
      '<h1 class="label__name">' + esc(it.name) + '</h1>' +
      '<p class="label__en">' + esc(it.en) + '</p>' +
      '<p class="label__formula">' + formulaHTML(it) + '</p>' +
      '<dl class="label__spec">' +
      '<div><dt>硬度</dt><dd>' + fmtMohs(it) + '</dd></div>' +
      '<div><dt>密度</dt><dd>' + esc(it.density) + '</dd></div>' +
      '<div><dt>' + (isMetal ? '纯度' : '晶系') + '</dt><dd>' +
      esc(isMetal ? it.purity[0] : it.crystal) + '</dd></div>' +
      '<div><dt>价格</dt><dd>' + PRICE[it.priceTier].label + '</dd></div>' +
      '</dl>' +
      '<div class="label__rows">' + rows + '</div>' +
      '</div>' +
      '<div class="label__foot"><span>No. ' + pad3(it.no) + '</span><span>Simon Workshop™</span></div>' +
      '</div>';
  }

  /* ------------------------------- 抽屉 ------------------------------- */

  function openDrawer(it, focusIt) {
    if (state.openId === it.id && !$('#drawer').hidden) return;
    state.openId = it.id;

    $('#drawerScroll').innerHTML = detailHTML(it);
    $('#drawerScroll').scrollTop = 0;
    $('#printSheet').innerHTML = printHTML(it);

    var drawer = $('#drawer');
    var scrim = $('#scrim');
    clearTimeout(closeTimer);

    drawer.hidden = false;
    scrim.hidden = false;
    document.body.classList.add('is-locked');

    requestAnimationFrame(function () {
      drawer.classList.add('is-open');
      scrim.classList.add('is-open');
    });

    if (focusIt !== false) {
      lastFocused = document.activeElement;
      $('#drawerClose').focus({ preventScroll: true });
    }
  }

  function closeDrawer(push) {
    var drawer = $('#drawer');
    if (!state.openId && drawer.hidden) return;

    state.openId = null;
    drawer.classList.remove('is-open');
    $('#scrim').classList.remove('is-open');
    document.body.classList.remove('is-locked');

    clearTimeout(closeTimer);
    closeTimer = setTimeout(function () {
      drawer.hidden = true;
      $('#scrim').hidden = true;
    }, 320);

    if (push !== false) {
      history.pushState(null, '', '#/' + state.view);
    }
    if (lastFocused && document.contains(lastFocused)) {
      try { lastFocused.focus({ preventScroll: true }); } catch (e) { /* noop */ }
    }
    lastFocused = null;
  }



  /* ------------------------------- 切工图鉴 ------------------------------- */

  function renderCuts() {
    var host = $('#cutGroups');
    if (host.dataset.done) return;
    host.innerHTML = CUT_GROUPS.map(function (g, gi) {
      var list = CUTS.filter(function (c) { return c.g === g.n; });
      return '<section class="cutgroup">' +
        '<header class="cutgroup__head">' +
        '<span class="cutgroup__no">0' + (gi + 1) + '</span>' +
        '<h2>' + list.length + ' 种' + g.title + '</h2>' +
        '<p>' + g.desc + '</p>' +
        '</header>' +
        '<div class="cutgrid">' + list.map(function (c) {
          return '<figure class="cutcard">' +
            '<div class="cutcard__art">' + art(c.id, g.color, { mode: 'line' }) + '</div>' +
            '<figcaption><b>' + c.cn + '</b><em>' + c.en + '</em></figcaption>' +
            '</figure>';
        }).join('') + '</div></section>';
    }).join('');
    host.dataset.done = '1';

    $('#settingGrid').innerHTML = SETTINGS.map(function (st) {
      return '<figure class="settingcard">' +
        '<div class="settingcard__art">' + settingArt(st.id) + '</div>' +
        '<figcaption>' +
        '<b>' + st.cn + '<em>' + st.en + '</em></b>' +
        '<p>' + st.desc + '</p>' +
        '<span class="settingcard__note">' + st.note + '</span>' +
        '</figcaption></figure>';
    }).join('');
  }


  /* ------------------------------- 晶形 ------------------------------- */

  function renderHabits() {
    var host = $('#habitGrid');
    if (host.dataset.done) return;
    host.innerHTML = HABITS.map(function (h) {
      var ex = GEM_ITEMS.filter(function (g) { return (g.habit || []).indexOf(h.id) > -1; }).slice(0, 4);
      var links = ex.map(function (g) {
        return '<a class="habitlink" href="#/gem/' + g.id + '">' + esc(g.name) + '</a>';
      }).join('');
      return '<figure class="habitcard">' +
        '<div class="habitcard__art">' + habitArt(h.id, '#C9B58A') + '</div>' +
        '<figcaption>' +
        '<b>' + h.cn + '<em>' + h.en + '</em></b>' +
        '<p>' + h.desc + '</p>' +
        '<span class="habitcard__eg">典型：' + h.eg + '</span>' +
        (links ? '<span class="habitcard__links">' + links + '</span>' : '') +
        '</figcaption></figure>';
    }).join('');
    host.dataset.done = '1';

    $('#systemGrid').innerHTML = SYSTEMS.map(function (s) {
      var links = s.link.map(function (id) {
        var g = BY_ID[id];
        return g ? '<a class="habitlink" href="#/gem/' + g.id + '">' + esc(g.name) + '</a>' : '';
      }).join('');
      return '<figure class="systemcard">' +
        '<div class="systemcard__art">' + systemArt(s.id) + '</div>' +
        '<figcaption>' +
        '<b>' + s.cn + '<em>' + s.en + '</em></b>' +
        '<span class="systemcard__cond">' + s.cond + '</span>' +
        '<span class="systemcard__eg">典型：' + s.eg + '</span>' +
        '<span class="habitcard__links">' + links + '</span>' +
        '</figcaption></figure>';
    }).join('') +
      '<figure class="systemcard">' +
      '<div class="systemcard__art">' + axesArt() + '</div>' +
      '<figcaption>' +
      '<b>轴与角<em>AXES</em></b>' +
      '<span class="systemcard__eg">a、b、c 是晶胞的三条边，α、β、γ 是它们之间的夹角。七个晶系，就是这三条边与三个角的不同关系。</span>' +
      '</figcaption></figure>';

    $('#sgGrid').innerHTML = SGS.map(function (g) {
      return '<figure class="sgcard">' +
        '<div class="sgcard__art">' + latticeArt(g.id) + '</div>' +
        '<figcaption>' +
        '<b>' + g.cn + '<em>' + g.id + '</em></b>' +
        '<p>' + g.desc + '</p>' +
        '<span class="systemcard__eg">例：' + g.eg + '</span>' +
        '</figcaption></figure>';
    }).join('');
  }

  /* ------------------------------- 名录 ------------------------------- */

  function renderLedger() {
    var all = GEM_ITEMS.concat(METAL_ITEMS);
    var cats = {}, origins = {}, months = {}, cutSet = {};

    all.forEach(function (it) {
      cats[it.category] = (cats[it.category] || 0) + 1;
      (it.origins || []).forEach(function (o) { origins[o] = 1; });
      (it.cuts || []).forEach(function (c) { cutSet[c] = 1; });
    });
    GEM_ITEMS.forEach(function (it) { if (it.birthstone) months[it.birthstone] = 1; });

    var catList = ['全部'].concat(Object.keys(cats));
    $('#lgFilters').innerHTML = catList.map(function (c) {
      var n = c === '全部' ? all.length : cats[c];
      return '<button class="chip" type="button" data-ledger-cat="' + esc(c) + '" aria-pressed="' +
        (state.ledgerCat === c ? 'true' : 'false') + '">' + esc(c) +
        '<span class="lg-filter__n">' + n + '</span></button>';
    }).join('');

    $('#lgTotal').textContent = all.length;
    $('#lgBreak').textContent = Object.keys(cats).map(function (c) {
      return c + ' ' + cats[c];
    }).join(' · ');

    var stats = [
      [all.length, '收录总数'],
      [Object.keys(cats).length, '类别'],
      [Object.keys(origins).length, '产地'],
      [Object.keys(cutSet).length, '在用切工'],
      [Object.keys(months).length + ' / 12', '生辰石覆盖']
    ];
    $('#lgStats').innerHTML = stats.map(function (s) {
      return '<div class="stat"><b>' + esc(s[0]) + '</b><span>' + s[1] + '</span></div>';
    }).join('');

    var shown = all.filter(function (it) {
      return state.ledgerCat === '全部' || it.category === state.ledgerCat;
    });

    $('#lgBody').innerHTML = shown.map(function (it) {
      var href = '#/' + (it.kind === 'metal' ? 'metal' : 'gem') + '/' + it.id;
      var cuts = (it.cuts || []).map(function (c) {
        return '<span class="cutchip">' + esc(CUT_LABEL[c] || c) + '</span>';
      }).join('') || '<span class="cutchip cutchip--none">—</span>';
      var wearCells = JEWELRY.map(function (j) {
        var v = it.jewelry ? (it.jewelry[j.id] || 0) : 0;
        var cls = v === 2 ? 'm2' : v === 1 ? 'm1' : 'm0';
        var ch = v === 2 ? '●' : v === 1 ? '○' : '×';
        return '<td class="mj ' + cls + '">' + ch + '</td>';
      }).join('');
      var birth = it.birthstone ? it.birthstone + ' 月' : '—';

      return '<tr data-id="' + it.id + '">' +
        '<td class="c-name"><a href="' + href + '">' + esc(it.name) + '<em>' + esc(it.en) + '</em></a></td>' +
        '<td class="c-cat">' + esc(it.category) + '</td>' +
        '<td class="c-num">' + fmtMohs(it) + '</td>' +
        '<td class="c-price">' + PRICE[it.priceTier].label + '</td>' +
        '<td class="c-cuts">' + cuts + '</td>' +
        wearCells +
        '<td class="c-birth">' + birth + '</td>' +
        '</tr>';
    }).join('');

    $('#lgCards').innerHTML = shown.map(function (it) {
      var href = '#/' + (it.kind === 'metal' ? 'metal' : 'gem') + '/' + it.id;
      var cuts = (it.cuts || []).map(function (c) {
        return '<span class="cutchip">' + esc(CUT_LABEL[c] || c) + '</span>';
      }).join('');
      var wearLine = JEWELRY.map(function (j) {
        var v = it.jewelry ? (it.jewelry[j.id] || 0) : 0;
        var cls = v === 2 ? 'm2' : v === 1 ? 'm1' : 'm0';
        var ch = v === 2 ? '●' : v === 1 ? '○' : '×';
        return '<span class="' + cls + '">' + j.name + ch + '</span>';
      }).join('');
      return '<a class="lg-card" href="' + href + '">' +
        '<span class="lg-card__top"><b>' + esc(it.name) + '</b><em>' + esc(it.en) + '</em><i>' + fmtMohs(it) + '</i></span>' +
        '<span class="lg-card__meta">' + esc(it.category) + ' · ' + PRICE[it.priceTier].label +
        (it.birthstone ? ' · ' + it.birthstone + ' 月' : '') + '</span>' +
        '<span class="lg-card__chips">' + cuts + '</span>' +
        '<span class="lg-card__wear">' + wearLine + '</span>' +
        '</a>';
    }).join('');
  }

  /* ------------------------------- 视图切换 ------------------------------- */

  function syncTabs() {
    $$('.tab').forEach(function (t) {
      t.classList.toggle('is-on', t.dataset.view === state.view);
    });
    $('#tabGems').textContent = GEM_ITEMS.length;
    $('#tabMetals').textContent = METAL_ITEMS.length;
    $('#tabTotal').textContent = GEM_ITEMS.length + METAL_ITEMS.length;
    $('#tabCuts').textContent = CUTS.length;
    $('#tabHabits').textContent = HABITS.length;
  }

  function setView(view) {
    var changed = state.view !== view;
    var isIndex = view === 'ledger' || view === 'cuts' || view === 'habits';
    state.view = view;

    document.body.classList.toggle('is-index', isIndex);
    $('#ledger').hidden = view !== 'ledger';
    $('#cuts').hidden = view !== 'cuts';
    $('#habits').hidden = view !== 'habits';
    $('#toolbarCount').hidden = !isIndex;

    if (changed) {
      state.page = 1;
      state.filters.category = null;
      state.filters.market = null;
      state.filters.birth = null;
      state.filters.mohs = null;
      state.moreOrigins = false;
      document.body.classList.remove('filters-open');
      $('#filterBtn').setAttribute('aria-expanded', 'false');
      if (!isIndex) renderRail();
      window.scrollTo(0, 0);
    }

    syncTabs();
    var note = document.querySelector('.rail__note');
    if (note) note.hidden = view !== 'gems';

    if (view === 'ledger') {
      $('#toolbarCount').textContent = '共 ' + (GEM_ITEMS.length + METAL_ITEMS.length) + ' 种 · 宝石 ' + GEM_ITEMS.length + ' / 金属 ' + METAL_ITEMS.length;
      renderLedger();
      return;
    }

    if (view === 'cuts') {
      $('#toolbarCount').textContent = '共 ' + CUTS.length + ' 种切工 · ' + CUT_GROUPS.length + ' 组';
      renderCuts();
      return;
    }

    if (view === 'habits') {
      $('#toolbarCount').textContent = '共 ' + HABITS.length + ' 种晶体习性';
      renderHabits();
      return;
    }

    renderGrid();
    renderRuler();
  }

  function route() {
    var raw = decodeURIComponent(location.hash.replace(/^#\/?/, '')).trim();
    if (!raw) { setView('gems'); closeDrawer(false); return; }

    var parts = raw.split('/');
    if (parts[0] === 'gems' || parts[0] === 'metals' || parts[0] === 'ledger' || parts[0] === 'cuts' || parts[0] === 'habits') {
      closeDrawer(false);
      setView(parts[0] === 'gems' || parts[0] === 'metals' ? parts[0] : parts[0]);
      return;
    }

    var it = null;
    if (parts[0] === 'gem' || parts[0] === 'metal') it = BY_ID[parts[1]];
    else it = BY_ID[parts[0]];

    if (it) {
      var view = it.kind === 'metal' ? 'metals' : 'gems';
      if (state.view !== view) setView(view);
      openDrawer(it);
    } else {
      setView('gems');
      closeDrawer(false);
    }
  }

  /* ------------------------------- 事件 ------------------------------- */

  function onSearch(value) {
    state.q = value.trim();
    state.page = 1;
    $('#qClear').hidden = !state.q;
    syncRail();
    renderGrid();
  }

  function resetAll() {
    state.filters = { hue: null, category: null, market: null, origin: null, birth: null, price: null, mohs: null };
    state.q = '';
    state.page = 1;
    $('#q').value = '';
    $('#qClear').hidden = true;
    syncRail();
    renderGrid();
  }

  function toggleFilter(key, val) {
    var cur = state.filters[key];
    var next = (cur != null && String(cur) === String(val)) ? null : val;
    state.filters[key] = key === 'price' || key === 'birth' || key === 'mohs' ? (next == null ? null : Number(next)) : next;
    state.page = 1;
    syncRail();
    renderGrid();
  }

  /* 搜索 */
  var onSearchInput = debounce(function (value) { onSearch(value); }, 110);

  $('#q').addEventListener('input', function (e) { onSearchInput(e.target.value); });

  $('#qClear').addEventListener('click', function () {
    $('#q').value = '';
    onSearch('');
    $('#q').focus();
  });

  /* 排序 */
  $('#sort').addEventListener('change', function (e) {
    state.sort = e.target.value;
    state.page = 1;
    renderGrid();
  });

  /* 筛选栏（事件委托） */
  $('#rail').addEventListener('click', function (e) {
    var btn = e.target.closest('[data-facet]');
    if (btn) {
      toggleFilter(btn.dataset.facet, btn.dataset.val);
      return;
    }
    if (e.target.id === 'moreOrigins') {
      state.moreOrigins = !state.moreOrigins;
      $$('#originChips [data-more]').forEach(function (el) { el.hidden = !state.moreOrigins; });
      e.target.textContent = state.moreOrigins ? '收起' : '更多';
    }
  });

  $('#resetBtn').addEventListener('click', resetAll);
  $('#emptyReset').addEventListener('click', resetAll);

  /* 激活筛选条 */
  $('#activeChips').addEventListener('click', function (e) {
    var b = e.target.closest('[data-remove]');
    if (!b) return;
    var k = b.dataset.remove;
    if (k === 'q') {
      $('#q').value = '';
      onSearch('');
    } else {
      state.filters[k] = null;
      state.page = 1;
      syncRail();
      renderGrid();
    }
  });

  /* 分页 */
  function goPage(n) {
    var pages = state.pages || 1;
    n = Math.max(1, Math.min(pages, Math.floor(n) || 1));
    state.page = n;
    renderGrid();
    var top = $('#grid').getBoundingClientRect().top + window.scrollY - 90;
    window.scrollTo({ top: top, behavior: 'smooth' });
  }

  function jumpToPage() {
    var input = $('#pageJump');
    if (!input) return;
    goPage(Number(input.value));
  }

  $('#pager').addEventListener('click', function (e) {
    if (e.target.closest('[data-jump]')) { jumpToPage(); return; }
    var b = e.target.closest('[data-page]');
    if (b && !b.disabled) goPage(Number(b.dataset.page));
  });

  $('#pager').addEventListener('keydown', function (e) {
    if (e.target.id === 'pageJump' && e.key === 'Enter') {
      e.preventDefault();
      jumpToPage();
    }
  });

  $('#pager').addEventListener('focusin', function (e) {
    if (e.target.id === 'pageJump') e.target.select();
  });

  /* 硬度尺 */
  $('#mohsAxis').addEventListener('click', function (e) {
    var b = e.target.closest('[data-n]');
    if (!b) return;
    toggleFilter('mohs', Number(b.dataset.n));
  });

  $('#mohsPlot').addEventListener('click', function (e) {
    var b = e.target.closest('.mk');
    if (!b) return;
    var it = BY_ID[b.dataset.id];
    if (!it) return;
    location.hash = '#/' + (it.kind === 'metal' ? 'metal' : 'gem') + '/' + it.id;
  });

  /* 卡片点击：走原生 href，保留中键 / 修饰键行为 */

  /* 详情内：相似宝石 / 产地 */
  $('#drawer').addEventListener('click', function (e) {
    if (e.target.id === 'printBtn') { window.print(); return; }
    var b = e.target.closest('[data-facet="origin"]');
    if (b && b.closest('#drawer')) {
      toggleFilter('origin', b.dataset.val);
      closeDrawer();
      return;
    }
    if (e.target.closest('.sim')) {
      // 让 hashchange 处理；先关闭旧抽屉避免叠加
      return;
    }
  });

  document.addEventListener('click', function (e) {
    var jump = e.target.closest('[data-scroll-to]');
    if (!jump) return;
    var target = document.getElementById(jump.dataset.scrollTo);
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  $('#drawerClose').addEventListener('click', function () { closeDrawer(); });
  $('#scrim').addEventListener('click', function () { closeDrawer(); });

  /* 随机 */
  $('#randomBtn').addEventListener('click', function () {
    var pool = filtered();
    if (!pool.length) pool = itemsFor(state.view);
    var it = pool[Math.floor(Math.random() * pool.length)];
    var hash = '#/' + (it.kind === 'metal' ? 'metal' : 'gem') + '/' + it.id;
    if (location.hash === hash) openDrawer(it);
    else location.hash = hash;
  });

  /* 移动端筛选开关 */
  $('#filterBtn').addEventListener('click', function () {
    var open = document.body.classList.toggle('filters-open');
    this.setAttribute('aria-expanded', open ? 'true' : 'false');
  });

  /* 键盘 */
  function isEditing(el) {
    return el && (/^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName) || el.isContentEditable);
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === '/' && !isEditing(e.target) && !e.metaKey && !e.ctrlKey && !e.altKey) {
      if (document.body.classList.contains('is-index')) return;
      e.preventDefault();
      $('#q').focus();
      $('#q').select();
      return;
    }
    if (e.key === 'Escape') {
      if (state.openId) { closeDrawer(); return; }
      if (isEditing(e.target)) {
        if (state.q) { $('#q').value = ''; onSearch(''); }
        e.target.blur();
        return;
      }
      if (document.body.classList.contains('filters-open')) {
        document.body.classList.remove('filters-open');
        $('#filterBtn').setAttribute('aria-expanded', 'false');
      }
    }
    if (e.key === 'Tab' && state.openId) {
      var drawer = $('#drawer');
      var focusables = $$('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])', drawer);
      if (!focusables.length) return;
      var first = focusables[0];
      var last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });


  /* 克拉换算 */
  function updateConvert() {
    var ct = parseFloat($('#ctInput').value);
    if (!isFinite(ct) || ct < 0) ct = 0;
    var gram = ct * 0.2;

    $('#outGram').textContent = gram.toFixed(2);
    $('#outPoint').textContent = String(Math.round(ct * 100));

    var price = parseFloat($('#goldInput').value);
    if (isFinite(price) && price > 0) {
      var val = gram * price;
      $('#outGold').textContent = '¥' + val.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    } else {
      $('#outGold').textContent = '—';
    }
  }

  $('#ctInput').addEventListener('input', updateConvert);
  $('#goldInput').addEventListener('input', updateConvert);

  /* 名录类别筛选 */
  $('#lgFilters').addEventListener('click', function (e) {
    var b = e.target.closest('[data-ledger-cat]');
    if (!b) return;
    state.ledgerCat = b.dataset.ledgerCat;
    renderLedger();
  });

  /* 名录表格点行 */
  $('#lgBody').addEventListener('click', function (e) {
    var tr = e.target.closest('tr[data-id]');
    if (!tr) return;
    var it = BY_ID[tr.dataset.id];
    if (!it) return;
    var hash = '#/' + (it.kind === 'metal' ? 'metal' : 'gem') + '/' + it.id;
    if (location.hash !== hash) location.hash = hash;
  });

  /* 路由 */
  window.addEventListener('hashchange', route);

  /* 响应式重排硬度尺 */
  window.addEventListener('resize', debounce(function () {
    renderRuler();
  }, 160));

  /* ------------------------------- 启动 ------------------------------- */

  syncTabs();
  renderRail();
  renderGrid();
  renderRuler();
  updateConvert();
  route();
})();
