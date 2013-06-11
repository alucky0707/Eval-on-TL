#Eval on TL

It is the twitter bot that evaluates your program. Of course, on twitter.

__[New in 2013/06/12] Support the "D" and "C#"!__

##Usage

You are tweeting now, so you cannot leave time-line. But you suddenly think to write program. At such time, you may tweet as follows.

```
@eval_of <language name> <your program>
```

If you do, the bot evaluats your program and reply this results to you.

For example,

```
@eval c int main(){
  printf("Hello, Twitter World!");
}
```

Let's tweet!

##Support Languages

In May 25 2013, there are supported.

|`<language name>`|execute command|
|-------------|---------------|
|awk|awk -f|
|bas|bwbasic|
|bf|bfi|
|c|tcc -run|
|el|emacs --script|
|error|list of languages|
|grass|grass|
|hs|runhugs|
|io|io|
|js|js|
|lazy|lazyk|
|lsp|ecl -shell|
|lua|lua|
|m4|m4|
|ml|ocaml|
|p6|perl6|
|php|php|
|pl|perl|
|pl516|/usr/local/perl5/perl-5.16.2/bin/perl|
|ps|gs -q -dNODISPLAY -dBATCH -dNOPAUSE|
|py|python|
|py3|python3.3|
|rb|ruby|
|rb19|ruby19|
|rb20|/usr/local/ruby2/bin/ruby|
|scm|gosh|
|tcl|tclsh|

But, really evaluating is entrusted by [lleval]. So, you should see it.

[New in 2013/06/12] Support the "D" Language (`<language name>` is `d` or `dlang`) and the "C#" Language (`<language name>` is `cs` or `csharp`), both are actioning via [ideone].

##License

This project is licensed by [New BSD License](http://www.freebsd.org/copyright/freebsd-license.html).

##Special Thanks
                                                      
 * [dankogai](https://twitter.com/#!/dankogai) - Thank you for providing [lleval]!
 * [ideone] - Thank you for providing [ideone]!

##Also

Please follow [@eval_of](https://twitter.com/eval_of) on Twitter!

- - -

(c)alucky0707 <alucky0707@myopera.com>

[lleval]: http://colabv6.dan.co.jp/lleval.html
[ideone]: http://ideone.com/
