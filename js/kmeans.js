/**
 * Created with JetBrains PhpStorm.
 * User: horsley
 * Date: 13-6-4
 * Time: 下午3:03
 * To change this template use File | Settings | File Templates.
 *
 * @link http://www.mymessedupmind.co.uk/index.php/javascript-k-mean-algorithm
 * 修改了全局变量的问题
 */
function kmeans(D, m, k) {
//    var m = [];
    var random_keys = [];
    while (m.length < k) {
        var x = Math.floor(Math.random() * D.length);
        if (random_keys.indexOf(x) == -1) {
            m.push(D[x]);
            random_keys.push(x);
        }
    }

    var temp_distance = 0;
    var old_m = [];
    deepCopy(old_m, m); //保存上一次的m
    var C = [];
    var iter_count = 0;

    do
    {
        for (var i = 0; i < k; i++) { //初始化每个簇
           C[i] = [];
        }
        var changed = false;

        for (var i = 0; i < D.length; i++) { //计算距离并分配对象
            var min_distance = -1;
            var min_clusters = 0;

            for (var clusters_loop = 0; clusters_loop < k; clusters_loop++) { //计算一个对象o和所有簇中心m的距离
                var dist = 0;

                for (var j = 0; j < D[i].length; j++) { //计算一个对象o和簇中心m的距离
                    dist += Math.pow(Math.abs(D[i][j] - m[clusters_loop][j]), 2);
                }

                temp_distance = Math.sqrt(dist);

                if (min_distance == -1) {
                    min_distance = temp_distance;
                    min_clusters = clusters_loop;
                }
                else if (temp_distance <= min_distance) {
                    min_clusters = clusters_loop;
                    min_distance = temp_distance;
                }

            }

            C[min_clusters].push(D[i].slice()); //对象分配到簇
        }

        for (var clusters_loop = 0; clusters_loop < k; clusters_loop++) { //计算每个簇的对象的和
            for (var i = 0; i < C[clusters_loop].length; i++) {
                for (var j = 0; j < C[clusters_loop][i].length; j++) {
                    m[clusters_loop][j] += C[clusters_loop][i][j]
                }
            }

            for (i = 0; i < m[clusters_loop].length; i++) { //计算新的聚类中心
                m[clusters_loop][i] = ( m[clusters_loop][i] / C[clusters_loop].length );

                if (m[clusters_loop][i] != old_m[clusters_loop][i]) {
                    changed = true;
                }
            }
            if (changed) { //如果m发生了改变，保存m，开始下一次迭代
                deepCopy(old_m, m);
            }
        }
        iter_count++;

    } while (changed == true); //( 3 ) Until j 不再变化
    console.log("迭代次数：" + iter_count);
    return C;
}

function getType(o)
{
    var _t;
    return ((_t = typeof(o)) == "object" ? o==null && "null" || Object.prototype.toString.call(o).slice(8,-1):_t).toLowerCase();
}
function deepCopy(target,source)
{
    for(var p in source)
    {
        if(getType(source[p])=="array"||getType(source[p])=="object")
        {
            target[p]=getType(source[p])=="array"?[]:{};
            arguments.callee(target[p],source[p]);
        }
        else
        {
            target[p]=source[p];
        }
    }
}