# tree shaking
目的就是减少应用中写出，但没有被实际运用的JS代码。这样，无用代码的清除，意味着更小的代码体积，bundle size的缩减，提升用户体验。  

## ES的export和export default
建议减少使用export default导出，一方面export default导出整体对象结果，不利于tree shaking进行分析；另一方面，export default导出的结果可以随意命名变量，不利于团队同一管理