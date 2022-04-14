---
title: Java MorseCoder - Java 语言实现的摩尔斯电码编码解码器
date: 2017-05-02 00:00:00
categories:
- 技术
- Java
tags:
- Java
- Morse
---
代码已经扔到 GitHub 上了，地址在 [https://github.com/TakWolf/Java-MorseCoder](https://github.com/TakWolf/Java-MorseCoder)

<!-- more -->

## 关于摩尔斯电码 ##

不详细介绍了，维基百科上面介绍的更详细。请参考：[维基百科 -> 摩尔斯电码](https://zh.wikipedia.org/wiki/摩尔斯电码)

说几个重要的概念。

摩尔斯电码由三种类型的信号组成，分别为：短信号（滴）、长信号（嗒）和分隔符。三种信号通常习惯使用“.”、“-”、“/”表示。

摩尔斯电码有一个密码表，用来映射密码。密码表如下：（注意：字母都会转换为大写，0 为短信号，1 为长信号。）

| 字符 | 电码 |
|---|---|
| A | 01 |
| B | 1000 |
| C | 1010 |
| D | 100 |
| E | 0 |
| F | 0010 |
| G | 110 |
| H | 0000 |
| I | 00 |
| J | 0111 |
| K | 101 |
| L | 0100 |
| M | 11 |
| N | 10 |
| O | 111 |
| P | 0110 |
| Q | 1101 |
| R | 010 |
| S | 000 |
| T | 1 |
| U | 001 |
| V | 0001 |
| W | 011 |
| X | 1001 |
| Y | 1011 |
| Z | 1100 |

| 字符 | 电码 |
|---|---|
| 0 | 11111 |
| 1 | 01111 |
| 2 | 00111 |
| 3 | 00011 |
| 4 | 00001 |
| 5 | 00000 |
| 6 | 10000 |
| 7 | 11000 |
| 8 | 11100 |
| 9 | 11110 |

| 字符 | 电码 |
|---|---|
| . | 010101 |
| , | 110011 |
| ? | 001100 |
| ' | 011110 |
| ! | 101011 |
| / | 10010 |
| ( | 10110 |
| ) | 101101 |
| & | 01000 |
| : | 111000 |
| ; | 101010 |
| = | 10001 |
| + | 01010 |
| - | 100001 |
| _ | 001101 |
| " | 010010 |
| $ | 0001001 |
| @ | 011010 |

我们拿到一个摩尔斯密文，第一步先要进行分割，拆分出每个字母。然后对照密码表进行翻译即可。

例如，我们有下面的密文：

```
.../---/...
```

拆分单词，得到三个字母，为：`...` `---` `...`。

对照密码表翻译，明文即为：SOS（国际通用求救信号）

就是这么简单。

## Unicode 字符集扩展 ##

摩尔斯电码只定义了很少的基本字符，甚至基本 ASCII 码表都没有补全。

我们希望可以编码更多的文字，比如中文、日文甚至 Emoji 表情字符。换句话说，我们希望可以支持所有的 Unicode 编码。怎么做呢？

有一种简单的方法，直接获取 Unicode 值的二进制，然后 0 替换为短信号，1 替换为长信号。

这样，是字典中定义的字母，则按照标准规范翻译，否则用二级制转换为 Unicode，理论上就可以支持所有字符。

该思路来源于：[https://github.com/hustcc/xmorse](https://github.com/hustcc/xmorse)

这是另外一个摩尔斯编码解码器实现，使用的是 Javascript 实现的。该项目中就使用了这个思路。

## Java 中关于 Unicode 的一些操作 ##

在 Java 中，一个 Unicode 被称为 codePoint，他是一个 int 型。

事实上，ASCII 码表也属于 Unicode。但是要注意的是，一个 Unicode 字符，可能由多个 char 组成。

这里的原理一两句话说不清，有兴趣去搜索一下 Unicode、Java 字符集相关的资源看看。

这里只说一下在 Java 中相关转换方法。

``` Java
// String 拆分 codePoint 示例
String text = "Some Text";
for (int i = 0; i < text.codePointCount(0, text.length()); i++) {
    int codePoint = text.codePointAt(i);
}

// char 数组拆分 codePoint 示例
char[] chars = new char[] {};
for (int i = 0; i < Character.codePointCount(chars, 0, chars.length); i++) {
    int codePoint = Character.codePointAt(chars, i);
}

// codePoint 转换为 String
char[] chars = Character.toChars(codePoint);
String text = new String(chars);

// 也可以通过 StringBuilder 来转换
new StringBuilder().appendCodePoint(codePoint).toString();
```

具体的参数含义，可以去看一下文档。

## 实现思路 ##

有了上面的铺垫，实现思路就非常清晰了。

我们定义两个 Map 结构：

一个叫做字母表，用于描述 codePoint 到摩尔斯电码的转换，编码时使用；

另一个叫做字典，用于描述摩尔斯电码到 codePoint 的转换，解码时使用。

这中间涉及到 codePoint 和 String 的互相转换问题。

遇到字典中未定义的字母，则按照 Unicode 的二进制值做转换。

``` Java
public final class MorseCoder {

    private static final Map<Integer, String> alphabets = new HashMap<>();    // code point -> morse
    private static final Map<String, Integer> dictionaries = new HashMap<>(); // morse -> code point

    private static void registeMorse(Character abc, String dict) {
        alphabets.put(Integer.valueOf(abc), dict);
        dictionaries.put(dict, Integer.valueOf(abc));
    }

    static {
        // Letters
        registeMorse('A', "01");
        registeMorse('B', "1000");
        registeMorse('C', "1010");
        registeMorse('D', "100");
        registeMorse('E', "0");
        registeMorse('F', "0010");
        registeMorse('G', "110");
        registeMorse('H', "0000");
        registeMorse('I', "00");
        registeMorse('J', "0111");
        registeMorse('K', "101");
        registeMorse('L', "0100");
        registeMorse('M', "11");
        registeMorse('N', "10");
        registeMorse('O', "111");
        registeMorse('P', "0110");
        registeMorse('Q', "1101");
        registeMorse('R', "010");
        registeMorse('S', "000");
        registeMorse('T', "1");
        registeMorse('U', "001");
        registeMorse('V', "0001");
        registeMorse('W', "011");
        registeMorse('X', "1001");
        registeMorse('Y', "1011");
        registeMorse('Z', "1100");
        // Numbers
        registeMorse('0', "11111");
        registeMorse('1', "01111");
        registeMorse('2', "00111");
        registeMorse('3', "00011");
        registeMorse('4', "00001");
        registeMorse('5', "00000");
        registeMorse('6', "10000");
        registeMorse('7', "11000");
        registeMorse('8', "11100");
        registeMorse('9', "11110");
        // Punctuation
        registeMorse('.', "010101");
        registeMorse(',', "110011");
        registeMorse('?', "001100");
        registeMorse('\'', "011110");
        registeMorse('!', "101011");
        registeMorse('/', "10010");
        registeMorse('(', "10110");
        registeMorse(')', "101101");
        registeMorse('&', "01000");
        registeMorse(':', "111000");
        registeMorse(';', "101010");
        registeMorse('=', "10001");
        registeMorse('+', "01010");
        registeMorse('-', "100001");
        registeMorse('_', "001101");
        registeMorse('"', "010010");
        registeMorse('$', "0001001");
        registeMorse('@', "011010");
    }

    private final char dit; // short mark or dot
    private final char dah; // longer mark or dash
    private final char split;

    public MorseCoder() {
        this('.', '-', '/');
    }

    public MorseCoder(char dit, char dah, char split) {
        this.dit = dit;
        this.dah = dah;
        this.split = split;
    }

    public String encode(String text) {
        if (text == null) {
            throw new IllegalArgumentException("Text should not be null.");
        }
        text = text.toUpperCase();
        StringBuilder morseBuilder = new StringBuilder();
        for (int i = 0; i < text.codePointCount(0, text.length()); i++) {
            int codePoint = text.codePointAt(i);
            String word = alphabets.get(codePoint);
            if (word == null) {
                word = Integer.toBinaryString(codePoint);
            }
            morseBuilder.append(word.replace('0', dit).replace('1', dah)).append(split);
        }
        return morseBuilder.toString();
    }

    public String decode(String morse) {
        if (morse == null) {
            throw new IllegalArgumentException("Morse should not be null.");
        }
        if (!StringUtils.containsOnly(morse, dit, dah, split)) {
            throw new IllegalArgumentException("Incorrect morse.");
        }
        String[] words = StringUtils.split(morse, split);
        StringBuilder textBuilder = new StringBuilder();
        for (String word : words) {
            word = word.replace(dit, '0').replace(dah, '1');
            Integer codePoint = dictionaries.get(word);
            if (codePoint == null) {
                codePoint = Integer.valueOf(word, 2);
            }
            textBuilder.appendCodePoint(codePoint);
        }
        return textBuilder.toString();
    }

}
```

代码非常简单，有了上面的铺垫，很容易理解，不在详细说明。

使用的时候，是这样的：

``` Java
public class MorseCoderTest {

    private final MorseCoder morseCoder = new MorseCoder();

    @Test
    public void test0() {
        String text = "Hello World!";
        String morse = "...././.-../.-../---/-...../.--/---/.-./.-../-../-.-.--/";
        Assert.assertEquals(morseCoder.encode(text), morse);
        Assert.assertEquals(morseCoder.decode(morse), text.toUpperCase());
    }

    @Test
    public void test1() {
        String text = "你好，世界！";
        String morse = "-..----.--...../-.--..-.-----.-/--------....--../-..---....-.--./---.-.-.-..--../--------.......-/";
        Assert.assertEquals(morseCoder.encode(text), morse);
        Assert.assertEquals(morseCoder.decode(morse), text);
    }

    @Test
    public void test2() {
        String text = "こんにちは";
        String morse = "--.....-.-..--/--....-..-..--/--.....--.-.--/--.....--....-/--.....--.----/";
        Assert.assertEquals(morseCoder.encode(text), morse);
        Assert.assertEquals(morseCoder.decode(morse), text);
    }

}
```

代码已经放到 GitHub 上面了，地址在 [https://github.com/TakWolf/Java-MorseCoder](https://github.com/TakWolf/Java-MorseCoder)

并且已经做了一点微小的工作，将代码制作成 module 发布到了中心仓库中（JCenter），具体使用方式去 Readme 看吧，兼容 Android 环境。

Have fun!
