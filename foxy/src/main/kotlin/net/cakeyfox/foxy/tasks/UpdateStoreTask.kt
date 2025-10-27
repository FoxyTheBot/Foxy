package net.cakeyfox.foxy.tasks

import mu.KotlinLogging
import net.cakeyfox.foxy.FoxyInstance
import net.cakeyfox.foxy.utils.RunnableCoroutine

class UpdateStoreTask(
    private val foxy: FoxyInstance
): RunnableCoroutine {

    companion object {
        private val logger = KotlinLogging.logger { }
    }

    override suspend fun run() {
        foxy.database.profile.updateStore()

        logger.info { "Daily store updated!" }
    }
}