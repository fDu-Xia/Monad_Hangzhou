function main(stream) {
    try {
        const data = stream.data[0]

        // 定义合约地址到平台名称的映射
        const contractMapping = {
            // DEX 合约
            '0xc816865f172d640d93712C68a7E1F83F3fA63235': ['dex','kuru'],
            '0xCa810D095e90Daae6e867c19DF6D9A8C56db2c89': ['dex','bean'],
            '0x88B96aF200c8a9c35442C8AC6cd3D22695AaE4F0': ['dex','ambient'],

            // Launchpad 合约
            '0x619d07287e87C9c643C60882cA80d23C8ed44652': ['launchpad','nad'],
            '0xd227d3bCE59b91380b7bc4A61A045B528B509439': ['launchpad','aicraft'],
            '0x4267F317adee7C6478a5EE92985c2BD5D855E274': ['launchpad','flap'],

            // LSD 合约
            '0xb2f82D0f38dc453D596Ad40A37799446Cc89274A': ['lsd','aPriori'],
            '0x2c9C959516e9AAEdB2C748224a41249202ca8BE7': ['lsd','magma'],
            '0xBce2C725304e09CEf4cD7639760B67f8A0Af5bc4': ['lsd','fastlane'],

            // Gamefi 合约
            '0xe0FA8195AE92b9C473c0c0c12c2D6bCbd245De47': ['gamefi','2048'],
            '0x66dD5e0BE80417Cef966D788079D9be7A8618753': ['gamefi','levrbet'],

            // SocialFi 合约
            '0xcBE623D259261FFa0CFAff44484bFF46c1b7D6c2': ['socialfi','talentum'],
            '0x18C9534dfe16a0314B66395F48549716FfF9AA66': ['socialfi','dusted'],
            '0xE2d7A1b5B3CF72A96489926df21d4895f': ['socialfi','deepdrop'],

            // NFT
            '0x1E134586bc39987fb38515147EE3c5ef20D4895f': ['nft','exogame'],
        }

        // 创建地址映射 (转为小写以便匹配)
        const addressMap = new Map()
        Object.entries(contractMapping).forEach(([address, platform]) => {
            addressMap.set(address.toLowerCase(), platform)
        })

        // 结果数组
        const points = []

        // 处理每个交易
        data.transactions.forEach(transaction => {
            // 检查交易是否有目标地址
            if (!transaction.to) return

            // 检查是否是我们监控的合约
            const platformInfo = addressMap.get(transaction.to.toLowerCase())
            if (!platformInfo) return

            if (platformInfo[0] === 'dex' || platformInfo[0] === 'lsd'){
                // 获取交易中的 native token 数量 (从 wei 转换为 ether)
                const valueInWei = BigInt(transaction.value || '0')
                if (valueInWei === BigInt(0)) return
                const valueInEther = Number(valueInWei) / Math.pow(10, 18)

                // 计算积分：小于1的取1，其他取整，0不计
                let pointsValue = valueInEther < 1 ? 1 : Math.floor(valueInEther)

                // 添加积分记录 [地址, 类型, 平台名, 积分]
                points.push([
                    transaction.from,
                    platformInfo[0],
                    platformInfo[1],
                    pointsValue
                ])
            } else {
                // 其他类型合约（gamefi, socialfi, nft, launchpad）给固定1分
                points.push([
                    transaction.from,
                    platformInfo[0],
                    platformInfo[1],
                    1
                ])
            }
        })

        // 如果没有任何积分，返回 null
        if (points.length === 0) {
            return null
        }

        // 返回积分数组
        return {
            points: points
        }

    } catch (e) {
        return { error: e.message }
    }
}