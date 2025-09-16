package net.cakeyfox.foxy.utils

import dev.arbjerg.lavalink.client.NodeOptions
import dev.arbjerg.lavalink.client.loadbalancing.RegionGroup
import mu.KotlinLogging
import net.cakeyfox.foxy.FoxyInstance

object LavalinkUtils {
    private val logger = KotlinLogging.logger { }

    fun registerNode(foxy: FoxyInstance) {
        val nodes = foxy.config.lavalink.nodes
        val lavalink = foxy.lavalink

        if (nodes.isEmpty()) {
            logger.warn { "No Lavalink nodes configured, music features will not work!" }
            return
        }

        nodes.forEach { node ->
            lavalink.addNode(
                NodeOptions.Builder()
                    .setName(node.name)
                    .setServerUri("ws://${node.host}:${node.port}")
                    .setPassword(node.password)
                    .apply {
                        node.region?.let { region ->
                            try {
                                val regionGroup = RegionGroup.valueOf(region.uppercase())
                                setRegionFilter(regionGroup)
                            } catch (_: IllegalArgumentException) {
                                logger.warn { "Invalid region '$region' for Lavalink node '${node.name}'" }
                            }
                        }
                    }
                    .build()
            )

            logger.info { "Registered Lavalink node '${node.name}' at ${node.host}:${node.port}" }
        }
    }
}