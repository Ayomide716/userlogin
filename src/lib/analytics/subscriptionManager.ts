import { Unsubscribe } from 'firebase/firestore';

class SubscriptionManager {
  private subscriptions: Map<string, Unsubscribe> = new Map();

  addSubscription(id: string, unsubscribe: Unsubscribe) {
    // Clean up existing subscription if it exists
    this.cleanupSubscription(id);
    
    // Add new subscription
    this.subscriptions.set(id, unsubscribe);
  }

  cleanupSubscription(id: string) {
    const unsubscribe = this.subscriptions.get(id);
    if (unsubscribe) {
      try {
        unsubscribe();
      } catch (error) {
        console.error(`Error cleaning up subscription ${id}:`, error);
      } finally {
        this.subscriptions.delete(id);
      }
    }
  }

  cleanupAll() {
    for (const [id] of this.subscriptions) {
      this.cleanupSubscription(id);
    }
  }

  isSubscriptionActive(id: string): boolean {
    return this.subscriptions.has(id);
  }
}

// Create a singleton instance
export const subscriptionManager = new SubscriptionManager();