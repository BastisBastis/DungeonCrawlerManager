const hexs=`e6dac5-beige1
e4c183-beige2
b1993a-yellow1
ca7c3b-orange1
9c4429-orange2
80592e-brown1
5a4439-brown2
443236-brown3
302b25-brown4
682c32-red1
9f81c5-purple1
7a6260-purple2
4f4d60-purple3
32293c-purple4
96c359-green1
606a40-green2
416553-green3
2c403c-green4
7899bf-blue1
2f4063-blue2
407685-bluegreen1
919284-grey1
666861-grey2
444d4e-grey3
353535-grey4
202020-grey5
ffffff-white
000000-black`

export const Palette={}

hexs.split("\n").forEach(s=>{
  const [hex,name]=s.split("-")
  Palette[name]={
    hex:Number("0x"+hex),
    string:"#"+hex
  }
})
